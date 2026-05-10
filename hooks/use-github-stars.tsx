
"use client";
import { useState, useEffect } from "react";

interface GitHubRepoStats {
  stars: number;
  loading: boolean;
  error: string | null;
}

export function useGitHubStars(owner: string, repo: string): GitHubRepoStats {
  const [stats, setStats] = useState<GitHubRepoStats>({
    stars: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        
        if (!response.ok) {
          console.warn(`GitHub API returned ${response.status}. Falling back to cached stars.`);
          const cached = localStorage.getItem(`github-stars-${owner}-${repo}`);
          if (cached) {
            setStats({
              stars: parseInt(cached, 10),
              loading: false,
              error: null,
            });
          } else {
            setStats({
              stars: 0,
              loading: false,
              error: `GitHub API returned ${response.status}`,
            });
          }
          return;
        }
        
        const data = await response.json();
        localStorage.setItem(`github-stars-${owner}-${repo}`, data.stargazers_count.toString());
        setStats({
          stars: data.stargazers_count,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.warn("Error fetching GitHub stars, using cache:", error);
        const cached = localStorage.getItem(`github-stars-${owner}-${repo}`);
        setStats({
          stars: cached ? parseInt(cached, 10) : 0,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchStars();

    // Poll for updates every 5 minutes
    const intervalId = setInterval(fetchStars, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [owner, repo]);

  return stats;
}
