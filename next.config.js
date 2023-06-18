const ContentSecurityPolicy = `
  default-src 'self' https://discord.com;
  script-src 'self';
  child-src example.com;
  style-src 'self' example.com;
  font-src 'self';  
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  // {
  //   key: "Content-Security-Policy",
  //   value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  // },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.discordapp.com", "i.imgur.com"],
  },
  productionBrowserSourceMaps: false,
  // async rewrites() {
  //   return [
  //     // {
  //     //   source: "/api/v1/addGuild",
  //     //   destination: `http://localhost:8000/api/v1/addGuild`,
  //     // },
  //     // {
  //     //   source: "/api/v1/loadGuild",
  //     //   destination: `http://localhost:8000/api/v1/loadGuild`,
  //     // },
  //   ];
  // },

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
