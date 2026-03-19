import type { GitHubUser, GitHubRepo } from "@/types";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
};

export async function getGitHubUser(): Promise<GitHubUser | null> {
  if (!GITHUB_USERNAME) return null;

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    return null;
  }
}

export async function getGitHubRepos(
  sort: "updated" | "pushed" | "created" | "stars" = "updated",
  limit: number = 10,
): Promise<GitHubRepo[]> {
  if (!GITHUB_USERNAME) return [];

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=${sort}&direction=desc&per_page=${limit}&type=owner`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

export async function getPinnedRepos(): Promise<GitHubRepo[]> {
  // GitHub API doesn't have a direct endpoint for pinned repos
  // We'll fetch the most starred repos as a proxy
  const repos = await getGitHubRepos("stars", 6);
  return repos.filter((repo) => repo.stargazers_count > 0);
}

export async function getRepoLanguages(
  repoName: string,
): Promise<Record<string, number>> {
  if (!GITHUB_USERNAME) return {};

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
      {
        headers,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return {};
    return response.json();
  } catch (error) {
    console.error("Error fetching repo languages:", error);
    return {};
  }
}

export async function getGitHubStats() {
  const user = await getGitHubUser();
  const repos = await getGitHubRepos("stars", 100);

  if (!user) return null;

  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0,
  );
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

  const languageStats: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
    }
  });

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([language, count]) => ({ language, count }));

  return {
    user,
    totalStars,
    totalForks,
    totalRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    topLanguages,
  };
}
