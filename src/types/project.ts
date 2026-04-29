import type { ImageMetadata } from 'astro';

export type IconName = 'Astro' | 'Tailwind' | 'Daisyui' | 'TypeScript' | 'JavaScript' | 'React' | 'Nextjs' | 'Nodejs' | 'AstroDB' | 'GithubActions'| 'Cloudflare' | 'Vercel' | 'Unknown' | 'Github' | 'Supabase' | 'ReactNative';

export interface Tag {
  name: string;
  type: 'primary' | 'secondary' | 'tertiary';
  icon: IconName;
}

export interface Project {
  repoName: string;
  isPrivate?: boolean;
  title: string;
  description: string;
  image: string | ImageMetadata;
  tags: Tag[];
  demoUrl: string;
  repoUrl: string;
  inProgress?: boolean;
  class?: string;
}
