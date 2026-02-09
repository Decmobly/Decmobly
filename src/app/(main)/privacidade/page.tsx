export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <article className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Política de Privacidade</h1>
        <div className="prose prose-stone max-w-none text-stone-600 space-y-6 font-light">
          <p className="font-medium text-stone-900">Última atualização: 08 de Fevereiro de 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wider">1. Coleta de Dados</h2>
            <p>
              A Decmobly coleta informações fornecidas voluntariamente por você ao solicitar orçamentos, 
              como nome, e-mail e telefone, exclusivamente para fins de atendimento e personalização de projetos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wider">2. Uso das Informações</h2>
            <p>
              Seus dados nunca serão vendidos ou compartilhados com terceiros para fins publicitários. 
              Utilizamos suas informações apenas para:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Enviar orçamentos solicitados;</li>
              <li>Agendar visitas técnicas;</li>
              <li>Comunicar atualizações sobre o status do seu projeto.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wider">3. Seus Direitos</h2>
            <p>
              Em conformidade com a LGPD, você tem o direito de solicitar a exclusão definitiva de seus dados 
              de nossa base de contatos a qualquer momento.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}