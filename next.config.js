/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === "development" ? '' : '/radiation_protection_education',
  assetPrefix: process.env.NODE_ENV === "development" ? '' : '/radiation_protection_education',
  reactStrictMode: true,
  trailingSlash: true,
}

module.exports = nextConfig
