"use client";

export default function LandingPage() {
  return (
<<<<<<< HEAD
    <main className="min-h-screen flex flex-col">
      {/* Hero com imagem de fundo */}
      <section
        className="relative h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} // troque pela imagem desejada
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Colecione. Troque. Complete seu Álbum.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8">
            Uma plataforma moderna para colecionadores de figurinhas de futebol. Organize sua coleção, 
            encontre figurinhas repetidas e troque com outros colecionadores de forma segura.
          </p>
          <a
            href="#features"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
          >
            Começar
          </a>
        </div>
      </section>

      {/* Seção — Sobre a Exatas Cup */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Sobre a Exatas Cup</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            A Exatas Cup é um campeonato de futsal organizado por estudantes do Instituto de Exatas da UnB.
            Participam alunos dos cursos de Matemática, Ciência da Computação e Estatística. Já tivemos
            edições em 2024 e 2025, com grande participação e espírito esportivo.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-4">
            Nosso álbum digital nasce como uma solução prática e interativa para divulgar os elencos,
            engajar torcedores e tornar o campeonato memorável — tudo com tecnologia web3.
=======
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mt-12 mb-16">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4 drop-shadow-sm">
          Collect. Trade. Complete Your Album.
        </h1>
        <p className="text-lg text-gray-700">
          A modern platform for football sticker collectors.
          Organize your collection, find duplicates, and trade with other collectors securely.
        </p>
      </section>

      {/* Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Build Your Collection</h2>
          <p className="text-gray-600">
            Register your stickers, mark the ones you own, and track your album's progress.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Secure Trades</h2>
          <p className="text-gray-600">
            Find other users who have stickers you need and make fair trades.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Connected to Ethereum</h2>
          <p className="text-gray-600">
            Stickers registered as ERC-1155 NFTs, ensuring authenticity and real ownership.
>>>>>>> a398068c6c0aff567709b8cc8c6bda53fd54a328
          </p>
        </div>
      </section>

      {/* Seção de funcionalidades / características */}
      <section id="features" className="py-16 bg-green-50 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">Monte Sua Coleção</h3>
            <p className="text-gray-600">Cadastre suas figurinhas, marque as que possui e acompanhe o progresso do álbum.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">Trocas Seguras</h3>
            <p className="text-gray-600">Encontre outros colecionadores, negocie trocas e finalize com segurança via blockchain.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">Autenticidade Web3</h3>
            <p className="text-gray-600">Todas as figurinhas são NFTs ERC-1155 registrados na rede Sepolia — propriedade real e verificável.</p>
          </div>
        </div>
      </section>

      {/* Seção de como usar / passos */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Como Usar</h2>
          <ol className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <li><strong>1.</strong> Instale a extensão MetaMask e crie uma carteira, se ainda não tiver.</li>
            <li><strong>2.</strong> Clique em <em>“Conectar Carteira”</em> para permitir o acesso à sua conta Ethereum.</li>
            <li><strong>3.</strong> Após conectar, explore a loja para comprar figurinhas ou vá para “Minhas Figurinhas”.</li>
            <li><strong>4.</strong> Conecte-se à rede Sepolia antes de comprar ou trocar figurinhas.</li>
            <li><strong>5.</strong> Use a aba de trocas para negociar com outros colecionadores — tudo assinado e registrado na blockchain.</li>
          </ol>
        </div>
      </section>

      <section className="mt-20 mb-32">
        {/* Título da seção */}
        <h2 className="text-3xl font-semibold text-green-700 drop-shadow-sm mb-10 text-center">
          Integrantes do Grupo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Card 1 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="/membros/panela-furada.jpg"
              alt="Foto do integrante 1"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">Gustavo Mello Tonnera</h3>
            <p className="text-gray-600 mt-1">Matrícula: 211055272</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="/membros/membro2.jpg"
              alt="Foto do integrante 2"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">Nome Completo 2</h3>
            <p className="text-gray-600 mt-1">Matrícula: 000000000</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="/membros/membro3.jpg"
              alt="Foto do integrante 3"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">Nome Completo 3</h3>
            <p className="text-gray-600 mt-1">Matrícula: 000000000</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="/membros/membro4.jpg"
              alt="Foto do integrante 4"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">Nome Completo 4</h3>
            <p className="text-gray-600 mt-1">Matrícula: 000000000</p>
          </div>

        </div>
      </section>


      {/* Footer */}
<<<<<<< HEAD
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="max-w-5xl mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Álbum de Figurinhas (Exatas Cup). Todos os direitos reservados.
        </div>
=======
      <footer className="mt-24 text-gray-500 text-sm">
        © {new Date().getFullYear()} Sticker Album — Collectors Platform
>>>>>>> a398068c6c0aff567709b8cc8c6bda53fd54a328
      </footer>
    </main>
  );
}