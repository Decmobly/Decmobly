import { Hammer, Award, Users, Heart } from 'lucide-react';

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] pt-32 pb-20">
      {/* HERO SOBRE */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4a986]">Nossa Essência</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">
              Tradição que molda o <span className="italic font-light">futuro</span>.
            </h1>
            <p className="text-lg text-stone-600 font-light leading-relaxed">
              A Decmobly nasceu do desejo de transformar a marcenaria tradicional em uma experiência de design exclusivo. 
              Cada peça que sai de nossa oficina carrega o compromisso com a perfeição e a história de quem a idealizou.
            </p>
          </div>
          <div className="relative aspect-4/5 bg-stone-200 overflow-hidden rounded-sm">
            <img 
              src="/hero-section.jpeg" 
              alt="Mãos artesãs trabalhando na madeira"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-stone-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Hammer, title: "Artesanal", desc: "O toque humano em cada detalhe do acabamento." },
              { icon: Award, title: "Qualidade", desc: "Matérias-primas selecionadas dos melhores fornecedores." },
              { icon: Users, title: "Parceria", desc: "Projetos construídos a quatro mãos com nossos clientes." },
              { icon: Heart, title: "Paixão", desc: "Amamos o que fazemos, e isso reflete em cada entrega." }
            ].map((v, i) => (
              <div key={i} className="space-y-4 text-center md:text-left">
                <v.icon className="text-[#c4a986] mx-auto md:mx-0" size={32} strokeWidth={1} />
                <h3 className="font-bold uppercase text-xs tracking-widest">{v.title}</h3>
                <p className="text-stone-400 text-sm font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}