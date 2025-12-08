export default function OrderCard({ order, userWallet }: { order: any, userWallet: string }) {
  // Verifica se quem está vendo o card é o dono da oferta
  const isMyOrder = userWallet && order.maker.toLowerCase() === userWallet.toLowerCase();

  const deadlineDate = order.deadline
    ? new Date(order.deadline).toLocaleString("pt-BR")
    : "Sem prazo";

  return (
    <div className={`bg-white shadow-md p-5 rounded-xl border hover:shadow-lg transition ${isMyOrder ? 'border-blue-200' : 'border-gray-200'}`}>
      {/* Header */}
      <h2 className={`text-lg font-bold mb-3 ${isMyOrder ? 'text-blue-700' : 'text-green-700'}`}>
        {isMyOrder ? "Sua Oferta" : `Oferta de ${order.maker.substring(0, 6)}...${order.maker.slice(-4)}`}
      </h2>

      {/* SEÇÃO 1: O que o Maker está oferecendo (tokenIdGive) */}
      <div className="mb-4">
        {/* LÓGICA INVERTIDA AQUI */}
        <p className="text-gray-700 font-semibold mb-1">
          {isMyOrder ? "Você entrega:" : "Você recebe:"}
        </p>
        
        <ul className="bg-green-50 p-3 rounded-lg border border-green-200">
          {order.tokenIdGive.map((id: number, i: number) => (
            <li key={i} className="text-gray-800">
              🟩 Figurinha <b>#{id}</b> — Quantidade:{" "}
              <b>{order.amountGive[i]}</b>
            </li>
          ))}
        </ul>
      </div>

      {/* SEÇÃO 2: O que o Maker quer em troca (tokenIdWant) */}
      <div className="mb-4">
        {/* LÓGICA INVERTIDA AQUI */}
        <p className="text-gray-700 font-semibold mb-1">
          {isMyOrder ? "Você recebe:" : "Você entrega:"}
        </p>

        <ul className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          {order.tokenIdWant.map((id: number, i: number) => (
            <li key={i} className="text-gray-800">
              🟧 Figurinha <b>#{id}</b> — Quantidade:{" "}
              <b>{order.amountWant[i]}</b>
            </li>
          ))}
        </ul>
      </div>

      {/* DEADLINE */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          ⏳ <b>Prazo:</b> {deadlineDate}
        </p>
      </div>
    </div>
  );
}