import type { IconName, Project, Tag } from "@/types/project";

const GITHUB_USERNAME = "Xetha666";
const PORTFOLIO_REPO = "portafolio-web";
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  language: string;
  private: boolean;
}

const ICON_MAPPING: Record<string, IconName> = {
  // Languages
  'typescript': 'TypeScript',
  'astro': 'Astro',
  'javascript': 'JavaScript',
  'react': 'React',
  'nextjs': 'Nextjs',
  'nodejs': 'Nodejs',
  'tailwind': 'Tailwind',
  'tailwindcss': 'Tailwind',
  'daisyui': 'Daisyui',
  'astrodb': 'AstroDB',
  'github-actions': 'GithubActions',
  'cloudflare': 'Cloudflare',
  'vercel': 'Vercel',
};

const DISPLAY_NAME_MAPPING: Record<string, string> = {
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'astro': 'Astro',
  'react': 'React',
  'nextjs': 'Next.js',
  'nodejs': 'Node.js',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'daisyui': 'DaisyUI',
  'astrodb': 'AstroDB',
  'github-actions': 'GitHub Actions',
  'cloudflare': 'Cloudflare',
  'vercel': 'Vercel',
};

const getDisplayName = (tech: string): string => {
  const key = tech.toLowerCase();
  return DISPLAY_NAME_MAPPING[key] || tech.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getIconForTech = (tech: string): IconName | null => {
  const key = tech.toLowerCase();
  return ICON_MAPPING[key] || null;
};

export const fetchGithubRepos = async (): Promise<Project[]> => {
  try {
    const url = GITHUB_TOKEN 
      ? `https://api.github.com/user/repos?sort=updated&per_page=20&visibility=all` 
      : `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`;

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'Astro-Portfolio-Client', // GitHub requiere un User-Agent identificativo
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GitHub API Error (${response.status} ${response.statusText}):`, errorBody);
      throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();

    return repos
      .filter(repo => repo.name !== PORTFOLIO_REPO)
      .map(repo => {
        const tags: Tag[] = [];
        
        // Trust ONLY topics as requested by the user
        if (repo.topics && repo.topics.length > 0) {
          repo.topics.forEach(topic => {
            const icon = getIconForTech(topic);
            const name = getDisplayName(topic);
            
            if (icon) {
              tags.push({
                name: name,
                type: 'secondary',
                icon: icon
              });
            } else {
              tags.push({
                name: `No he reconocido la tecnología "${topic}"`,
                type: 'tertiary',
                icon: 'Unknown'
              });
            }
          });
        } else {
          // If no topics found
          tags.push({
            name: "No hay topics",
            type: 'tertiary',
            icon: 'Unknown'
          });
        }

        return {
          repoName: repo.name,
          title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: repo.description || "Sin descripción disponible.",
          image: `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`,
          tags: tags,
          demoUrl: repo.homepage || repo.html_url,
          repoUrl: repo.html_url,
          isPrivate: repo.private
        };
      });
  } catch (error) {
    console.error("Error fetching projects from GitHub:", error);
    return [];
  }
};
