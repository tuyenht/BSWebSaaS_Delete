/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@bsweb/frontend", "@bsweb/shared", "@bsweb/cms"],
  serverExternalPackages: ["pg", "@payloadcms/db-postgres", "@payloadcms/drizzle"],
  experimental: {
    turbo: {
      rules: {
        "*.md": {
          loaders: ["file"]
        },
        "*.exe": {
          loaders: ["file"]
        }
      }
    }
  }
};

export default nextConfig;
