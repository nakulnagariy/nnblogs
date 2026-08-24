import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NNBlogs — Personal Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#0a0a0a",
          padding: "64px 72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient accent */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0) 70%)",
          }}
        />

        {/* Top label */}
        <div
          style={{
            position: "absolute",
            top: "56px",
            left: "72px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              color: "#6b7280",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            nnblogs.dev
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#f9fafb",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            NNBlogs
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#9ca3af",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            Articles on web development, AI, and building things.
          </p>
        </div>

        {/* Bottom tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["Next.js", "TypeScript", "Web Dev"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                borderRadius: "9999px",
                border: "1px solid #27272a",
                backgroundColor: "#18181b",
                color: "#a1a1aa",
                fontSize: "16px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
