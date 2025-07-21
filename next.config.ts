import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"],
  },
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
