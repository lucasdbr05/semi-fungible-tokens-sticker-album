"use client";

export default function LandingPage() {
  return (
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
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-gray-500 text-sm">
        © {new Date().getFullYear()} Sticker Album — Collectors Platform
      </footer>
    </main>
  );
}