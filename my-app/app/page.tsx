"use client";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero com imagem de fundo */}
      <section
        className="relative h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} // troque pela imagem desejada
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Collect. Trade. Complete Your Album.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8">
            A modern platform for football sticker collectors. Organize your
            collection, find duplicates, and trade with other collectors safely.
          </p>
          <a
            href="#features"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Seção — Sobre a Exatas Cup */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            About Exatas Cup
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The Exatas Cup is a futsal championship organized by students from
            the Institute of Exact Sciences at UnB. Students from Mathematics,
            Computer Science, and Statistics participate. We have already held
            editions in 2024 and 2025, with great engagement and sportsmanship.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-4">
            Our digital album emerges as a practical and interactive solution to
            showcase team rosters, engage fans, and make the championship
            memorable — all using Web3 technology.
          </p>
        </div>
      </section>

      {/* Seção de funcionalidades / características */}
      <section id="features" className="py-16 bg-green-50 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">
              Build Your Collection
            </h3>
            <p className="text-gray-600">
              Register your stickers, mark the ones you own, and track your
              album progress.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">
              Secure Trades
            </h3>
            <p className="text-gray-600">
              Find other collectors, negotiate trades, and finalize everything
              securely through blockchain.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">
              Web3 Authenticity
            </h3>
            <p className="text-gray-600">
              All stickers are ERC-1155 NFTs registered on the Sepolia network —
              real and verifiable ownership.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de como usar / passos */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            How to Use
          </h2>
          <ol className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <li>
              <strong>1.</strong> Install the MetaMask extension and create a
              wallet if you don’t have one.
            </li>
            <li>
              <strong>2.</strong> Click “Connect Wallet” to allow access to your
              Ethereum account.
            </li>
            <li>
              <strong>3.</strong> After connecting, explore the store to buy
              stickers or go to “My Stickers”.
            </li>
            <li>
              <strong>4.</strong> Connect to the Sepolia network before buying
              or trading stickers.
            </li>
            <li>
              <strong>5.</strong> Use the trades tab to negotiate with other
              collectors — everything signed and recorded on the blockchain.
            </li>
          </ol>
        </div>
      </section>

      <section className="mt-20 mb-32">
        {/* Título da seção */}
        <h2 className="text-3xl font-semibold text-green-700 drop-shadow-sm mb-10 text-center">
          Team Members
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="/membros/panela-furada.jpg"
              alt="Foto do integrante 1"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              Gustavo Mello Tonnera
            </h3>
            <p className="text-gray-600 mt-1">Matrícula: 211055272</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="/membros/membro2.png"
              alt="Foto do integrante 2"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              Cauê de Macedo Britto Trindade de Sousa
            </h3>
            <p className="text-gray-600 mt-1">Matrícula: 231019003</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="https://avatars.githubusercontent.com/u/123587411?v=4"
              alt="Foto do integrante 3"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              Lucas Gabriel de Oliveira lima
            </h3>
            <p className="text-gray-600 mt-1">Matrícula: 231003406</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <img
              src="/membros/membro4.jpg"
              alt="Foto do integrante 4"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-green-600"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              Wallysson Matheus de Queiroz Silva
            </h3>
            <p className="text-gray-600 mt-1">Matrícula: 231038798</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="max-w-5xl mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Sticker Album (Exatas Cup). All rights
          reserved..
        </div>
      </footer>
    </main>
  );
}
