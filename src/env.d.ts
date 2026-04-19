/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN: string;
  readonly RESEND_API_KEY: string;
  readonly DESTINATION_EMAIL: string;
  readonly STITCH_API_KEY: string;
  readonly STITCH_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        RATELIMIT_KV: KVNamespace;
        RESEND_API_KEY?: string;
        DESTINATION_EMAIL?: string;
        GITHUB_TOKEN?: string;
      };
    };
  }
}
