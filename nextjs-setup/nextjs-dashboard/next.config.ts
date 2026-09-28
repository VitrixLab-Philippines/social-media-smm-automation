import type { NextConfig } from 'next';
import { resolve } from 'node:path';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'pg'],

  // Explicitly tell Turbopack where the monorepo root is.
  // This fixes "Could not find the Next.js package" in pnpm workspaces.
  turbopack: {
    root: resolve(process.cwd(), '..', '..'),
  },
};

export default nextConfig;