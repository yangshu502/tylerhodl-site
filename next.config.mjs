/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Proxy /monitor/* → haohaozhuanqian.pages.dev/monitor/*
      { source: '/monitor', destination: 'https://haohaozhuanqian.pages.dev/monitor' },
      { source: '/monitor/:path*', destination: 'https://haohaozhuanqian.pages.dev/monitor/:path*' },
      // Proxy /wallet/* → tylerhodl.pages.dev/wallet/*
      { source: '/wallet', destination: 'https://tylerhodl.pages.dev/wallet/' },
      { source: '/wallet/:path*', destination: 'https://tylerhodl.pages.dev/wallet/:path*' },
    ]
  },
}

export default nextConfig
