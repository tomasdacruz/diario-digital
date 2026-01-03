/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <--- AGREGA ESTA LÍNEA
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;