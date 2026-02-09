// src/components/ui/Logo.tsx
import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="relative h-full w-auto aspect-2048/500">
      <Image 
        src="/logo.jpg" 
        alt="Decmobly Logo"
        width={2048}  
        height={500} 
        // OTIMIZAÇÃO CRUCIAL:
        // No mobile (até 768px), assume que o logo tem aprox 180px de largura.
        // No desktop, assume aprox 250px.
        // Isso impede o download da imagem 4K original.
        sizes="(max-width: 768px) 180px, 250px"
        className="h-full w-auto object-contain"
        priority={true} 
      />
    </div>
  );
};

export default Logo;