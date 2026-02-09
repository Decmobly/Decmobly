import { Instagram, MapPin, Phone, MessageCircle, Link } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1c1917] text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          
          {/* COLUNA 1: MARCA (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-white uppercase">Decmobly</span>
              <span className="text-xs text-[#c4a986] font-bold tracking-[0.2em]">Excelência em Marcenaria</span>
            </div>
            <p className="text-sm leading-relaxed text-white">
              Transformamos espaços com móveis planejados que unem estética e funcionalidade. Projetos exclusivos para quem não abre mão da qualidade. Atendemos Manaus e região.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-stone-700 rounded-full hover:border-[#c4a986] hover:text-white transition-all" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/5597984208329?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20um%20móvel%20personalizado." className="p-2 border border-stone-700 rounded-full hover:border-[#c4a986] hover:text-white transition-all" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* COLUNA 2: CONTATOS (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Onde Estamos</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#c4a986] shrink-0" />
                <span className="text-white">Av. Cravina dos Poetas, 413 - Alvorada, Manaus - AM<br/>CEP: 69045-000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#c4a986] shrink-0" />
                <a href="https://wa.me/5597984208329?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20um%20móvel%20personalizado." className="text-white hover:text-white hover:underline decoration-stone-700">(97) 98420-8329</a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram size={20} className="text-[#c4a986] shrink-0" />
                <a href="https://www.instagram.com/decmoblyplanejados/" className="text-white hover:text-white hover:underline decoration-stone-700">@decmoblyplanejados</a>
              </li>
            </ul>
          </div>

          {/* COLUNA 3: GOOGLE MAPS (4 colunas) */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Nossa Localização</h3>
            <div className="w-full h-48 rounded-lg overflow-hidden border border-stone-700 relative">
              {/* Substituir o SRC pela chave real da API ou Embed do Google */}
              <iframe
                title="Mapa de localização Decmobly"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.118191232713!2d-60.0422696!3d-3.0630574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926c11eb4be27a91%3A0x259ae8755446b34a!2sDecmobly!5e0!3m2!1spt-BR!2sbr!4v1770495157326!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 1 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* RODAPÉ FINAL */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-[11px] text-stone-500 uppercase font-bold tracking-widest gap-4">
          <p>© {new Date().getFullYear()} Decmobly - Todos os direitos reservados. | Desenvolvido por <a href="https://levbrands.com.br" target="_blank" className="hover:text-white underline">Lev Brands</a> | <a href="/gestor/login" target="_blank" className="hover:text-white underline">Acessar painel</a></p>
          <div className="flex gap-6">
            <a href="/privacidade" className="hover:text-white transition-colors">Privacidade</a>
            <a href="/termos" className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}