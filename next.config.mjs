/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
  },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
        {protocol: 'https',
          hostname: 'https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg'
        },
        {protocol:'https',hostname: "img.clerk.com"}
      ],
    },
  };  
  
  export default nextConfig;
  