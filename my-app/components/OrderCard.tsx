import React from "react";

export default function OrderCard({ order }: { order: any }) {
  const deadlineDate = order.deadline
    ? new Date(order.deadline).toLocaleString("pt-BR")
    : "Sem prazo";

  return (
    <div className="bg-white shadow-md p-5 rounded-xl border border-gray-200 hover:shadow-lg transition">
      {/* Header */}
      <h2 className="text-lg font-bold text-green-700 mb-3">
        Oferta de {order.maker.substring(0, 6)}...{order.maker.slice(-4)}
      </h2>

      {/* GIVES */}
      <div className="mb-4">
        <p className="text-gray-700 font-semibold mb-1">Entrega (Give):</p>
        <ul className="bg-green-50 p-3 rounded-lg border border-green-200">
          {order.tokenIdGive.map((id: number, i: number) => (
            <li key={i} className="text-gray-800">
              🟩 Figurinha <b>#{id}</b> — Quantidade: <b>{order.amountGive[i]}</b>
            </li>
          ))}
        </ul>
      </div>

      {/* WANTS */}
      <div className="mb-4">
        <p className="text-gray-700 font-semibold mb-1">Recebe (Want):</p>
        <ul className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          {order.tokenIdWant.map((id: number, i: number) => (
            <li key={i} className="text-gray-800">
              🟧 Figurinha <b>#{id}</b> — Quantidade: <b>{order.amountWant[i]}</b>
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
