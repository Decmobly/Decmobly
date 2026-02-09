/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  
  // Configurações de imagens (que você provavelmente já tem para o Blob/Unsplash)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite imagens externas (Blob, Unsplash, etc)
      },
    ],
  },
  
  // --- ADICIONE ESTA PARTE ---
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', 
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'], 
  
    },
  },
  // ---------------------------
};

export default nextConfig;