import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/admin/assign-role
 * Bootstrap utility: assigns ADMIN role to the current authenticated user.
 *
 * Requires the request body to include a `setupToken` that matches the
 * ADMIN_SETUP_TOKEN environment variable. Set this env var on the server
 * and keep it secret — this prevents any arbitrary user from self-promoting.
 *
 * Usage (one-time setup):
 *   POST /api/admin/assign-role
 *   { "setupToken": "<value of ADMIN_SETUP_TOKEN>" }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // 2. Verify setup token — prevents self-promotion without the secret
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    if (!setupToken) {
      return NextResponse.json(
        { error: "ADMIN_SETUP_TOKEN is not configured on this server" },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => ({}));
    if (!body.setupToken || body.setupToken !== setupToken) {
      return NextResponse.json(
        { error: "Invalid or missing setup token" },
        { status: 403 },
      );
    }

    // 3. Assign role via Clerk API using public_metadata (server-only, safer than unsafe_metadata)
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    if (!clerkApiKey) {
      return NextResponse.json(
        { error: "Clerk API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${clerkApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: { role: "ADMIN" },
      }),
    });

    if (!response.ok) {
      console.error("Clerk API error assigning role, status:", response.status);
      return NextResponse.json(
        { error: "Failed to assign role" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "ADMIN role assigned. Sign out and back in to apply.",
    });
  } catch (error) {
    console.error("Error in assign-role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
