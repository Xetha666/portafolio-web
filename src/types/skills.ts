import AstroDB from "@/components/icons/AstroDB.astro";
import AstroIcon from "@/components/icons/AstroIcon.astro";
import Cloudflare from "@/components/icons/Cloudflare.astro";
import Daisyui from "@/components/icons/Daisyui.astro";
import GithubActions from "@/components/icons/GithubActions.astro";
import JavaScript from "@/components/icons/JavaScript.astro";
import React from "@/components/icons/React.astro";
import ReactNative from "@/components/icons/ReactNative.astro";
import Supabase from "@/components/icons/Supabase.astro";
import Tailwind from "@/components/icons/Tailwind.astro";
import TypeScript from "@/components/icons/TypeScript.astro";
import VercelIcon from "@/components/icons/VercelIcon.astro";

export interface SkillItem {
  name: string;
  Icon: any;
  learning?: boolean;
}

export interface SkillCategory {
  title: string;
  titleEn?: string;
  items: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Arquitectura Frontend",
    titleEn: "Frontend Architecture",
    items: [
      { name: "Astro", Icon: AstroIcon },
      { name: "React", Icon: React },
      { name: "TypeScript", Icon: TypeScript },
      { name: "Tailwind", Icon: Tailwind },
      { name: "JavaScript", Icon: JavaScript },
      { name: "DaisyUI", Icon: Daisyui },
      { name: "React Native", Icon: ReactNative, learning: true },
    ]
  },
  {
    title: "Backend y Ecosistema",
    titleEn: "Backend & Ecosystem",
    items: [
      { name: "Astro DB", Icon: AstroDB },
      { name: "Cloudflare", Icon: Cloudflare },
      { name: "Github Actions", Icon: GithubActions },
      { name: "Vercel", Icon: VercelIcon },
      { name: "Supabase", Icon: Supabase, learning: true },
    ]
  }
];
