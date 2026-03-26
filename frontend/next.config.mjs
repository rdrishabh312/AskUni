/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/AskUni' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/AskUni/' : '',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
