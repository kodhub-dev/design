import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';

initOpenNextCloudflareForDev();

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kodhub-design/db'],
};

export default config;
