"use client";

import { useState, useEffect } from "react";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

const GITHUB_USERNAME = "TheRealSaiTama";
const CACHE_KEY = "github_repos_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useGitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRepos(data);
          setLoading(false);
          return;
        }
      }

      try {
        // Fetch all pages of repos (GitHub API returns max 100 per page)
        let allRepos: GitHubRepo[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=pushed&direction=desc`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch repos");
          }

          const data: GitHubRepo[] = await response.json();
          
          if (data.length === 0) {
            hasMore = false;
          } else {
            allRepos = [...allRepos, ...data];
            page++;
            // Safety limit to prevent infinite loops
            if (page > 10) hasMore = false;
          }
        }

        // Filter out forks and archived repos, sort by pushed_at (most recent first)
        const filteredRepos = allRepos
          .filter((repo) => !repo.fork && !repo.archived)
          .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

        // Cache the results
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: filteredRepos, timestamp: Date.now() })
        );

        setRepos(filteredRepos);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Try to use stale cache if available
        if (cached) {
          const { data } = JSON.parse(cached);
          setRepos(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
}

// Language colors mapping
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Jupyter: "#DA5B0B",
  Markdown: "#083fa1",
};
