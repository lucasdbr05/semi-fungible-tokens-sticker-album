"use client";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mt-12 mb-16">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4 drop-shadow-sm">
          Colecione. Troque. Complete seu Álbum.
        </h1>
        <p className="text-lg text-gray-700">
          Uma plataforma moderna para colecionadores de figurinhas de futebol.
          Organize sua coleção, encontre figurinhas repetidas e troque com outros colecionadores de forma segura.
        </p>
      </section>

      {/* Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Monte Sua Coleção</h2>
          <p className="text-gray-600">
            Cadastre suas figurinhas, marque as que possui e acompanhe o progresso do seu álbum.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Trocas Seguras</h2>
          <p className="text-gray-600">
            Encontre outros usuários que possuem figurinhas que você precisa e realize trocas justas.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Conectado ao Ethereum</h2>
          <p className="text-gray-600">
            Figurinhas registradas como NFTs ERC-1155, garantindo autenticidade e propriedade real.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-gray-500 text-sm">
        © {new Date().getFullYear()} Álbum de Figurinhas — Plataforma de Colecionadores
      </footer>
    </main>
  );
}
