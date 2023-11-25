/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'expornpm t',
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'srirachandrice.imgix.net',
          },
          {
            protocol: 'https',
            hostname: 'i.imgur.com'
          }
        ],
      },
}

module.exports = nextConfig
