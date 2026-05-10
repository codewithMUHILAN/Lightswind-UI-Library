// lib/githubClient.ts

// --- CONFIGURATION ---
// REPLACE with your actual GitHub repository details
const GITHUB_OWNER = "codewithMUHILAN";
const GITHUB_REPO = "Lightswind-UI-Library";
const GITHUB_BRANCH = "master";

// Use an environment variable for your GitHub Personal Access Token (PAT)
// This is necessary for rate limiting and fetching private content (if applicable)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// The base API URL for content
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/`;
// ---------------------

/**
 * Fetches content (file or directory listing) from the GitHub repository.
 * @param path The path to the file or directory, e.g., 'Templates/portfolio01Source' or 'Templates/portfolio01Source/index.tsx'
 */
export async function fetchFromGitHub(path: string): Promise<any> {
    if (!GITHUB_TOKEN) {
        console.warn("GITHUB_PAT environment variable is not set. API calls might be rate-limited.");
    }

    const url = `${GITHUB_API_URL}${path}?ref=${GITHUB_BRANCH}`;

    const headers = {
        'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : '',
        'Accept': 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    };

    const res = await fetch(url, {
        headers,
        // Next.js fetch options to prevent aggressive caching
        next: { revalidate: 60 * 5 } // Revalidate every 5 minutes
    });

    if (!res.ok) {
        // Log the full response error for debugging
        const errorBody = await res.text();
        console.error(`GitHub fetch failed for ${path}. Status: ${res.status}. Error: ${errorBody}`);
        throw new Error(`Failed to fetch from GitHub: ${res.statusText}`);
    }

    return res.json();
}
