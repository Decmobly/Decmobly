export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <article className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Termos de Condições de Uso</h1>
        <div className="prose prose-stone max-w-none text-stone-600 space-y-6 font-light">
          
          <section className="space-y-4 p-6 bg-stone-50 border-l-4 border-stone-900">
            <h2 className="text-lg font-bold text-stone-900 uppercase">Resumo</h2>
            <p className="text-sm italic">
              Ao acessar este site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wider">1. Uso de Imagens</h2>
            <p>
              Todas as imagens de projetos exibidas neste portfólio são de propriedade intelectual da Decmobly. 
              A reprodução, cópia ou uso comercial sem autorização prévia é estritamente proibida.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wider">2. Orçamentos e Projetos</h2>
            <p>
              Os valores apresentados em orçamentos iniciais são estimativas baseadas em medidas preliminares. 
              O valor final do projeto só é confirmado após a medição técnica in loco e escolha definitiva de materiais.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wider">3. Limitação de Responsabilidade</h2>
            <p>
              A Decmobly não se responsabiliza por variações naturais nas cores e veios da madeira (MDF ou madeira maciça), 
              que são características intrínsecas ao material e não constituem defeito de fabricação.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}