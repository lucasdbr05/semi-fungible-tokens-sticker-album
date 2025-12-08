"use client";

import AcceptOrderModal from "@/components/AcceptOrderModal";
import CreateOrderModal from "@/components/CreateOrderModal";
import OrderCard from "@/components/OrderCard";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import contractInfo from "../../contract-info.json";
import { db } from "../../firebase";

export default function TrocasPage() {
  const savedWallet = localStorage.getItem("wallet_address") as string;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);

  async function loadOrders() {
    setLoading(true);

    try {
      const q = query(collection(db, "orders"));
      const snapshot = await getDocs(q);
      console.log("📚 Total de documentos encontrados:", snapshot.size);
      snapshot.forEach((d) => console.log("📄 DOC:", d.id, d.data()));

      const parsedOrders = snapshot.docs.map((doc) => {
        const raw = doc.data();

        console.log("📄 Order bruta recebida:", raw);

        const normalized = {
          id: doc.id,

          maker: raw.maker ?? "",
          taker: raw.taker ?? "0x0",

          tokenGive: raw.tokenGive ?? "",
          tokenWant: raw.tokenWant ?? "",

          tokenIdGive: Array.isArray(raw.tokenIdGive)
            ? raw.tokenIdGive.map(Number)
            : [Number(raw.tokenIdGive)],

          amountGive: Array.isArray(raw.amountGive)
            ? raw.amountGive.map(Number)
            : [Number(raw.amountGive)],

          tokenIdWant: Array.isArray(raw.tokenIdWant)
            ? raw.tokenIdWant.map(Number)
            : [Number(raw.tokenIdWant)],

          amountWant: Array.isArray(raw.amountWant)
            ? raw.amountWant.map(Number)
            : [Number(raw.amountWant)],

          nonce: Number(raw.nonce) || 0,

          // deadline pode vir como Firestore Timestamp OU número
          deadline: raw.deadline?.seconds
            ? raw.deadline.seconds * 1000
            : Number(raw.deadline),

          createdAt: raw.createdAt?.seconds
            ? raw.createdAt.seconds * 1000
            : raw.createdAt ?? null,

          signature: raw.signature ?? "",
        };

        console.log("✅ Order normalizada:", normalized);

        return normalized;
      });

      setOrders(parsedOrders);
    } catch (err) {
      console.error("🔥 Erro ao carregar orders:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Trocas de Figurinhas 🔄
        </h1>

        {/* Botão Criar */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow"
          >
            ➕ Criar Order
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 text-lg">Carregando...</p>
        )}

        {/* Vazio */}
        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-600 text-lg">
            Nenhuma order criada ainda.
          </p>
        )}

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="relative">
              <OrderCard order={order} />

              {/* Accept Button */}
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setOpenAcceptModal(true);
                }}
                className="absolute bottom-3 right-3 bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg shadow hover:bg-green-700 transition"
              >
                ✅ Aceitar
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        <CreateOrderModal
          userWallet={savedWallet}
          albumAddress={contractInfo.address}
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            loadOrders();
          }}
        />
        <AcceptOrderModal
          isOpen={openAcceptModal}
          onClose={() => {
            setOpenAcceptModal(false);
            setSelectedOrder(null);
            loadOrders();
          }}
          order={selectedOrder}
          signature={selectedOrder?.signature}
          albumAddress={contractInfo.address}
          swapAddress={contractInfo.swap_address}
          userWallet={savedWallet}
        />
      </div>
    </div>
  );
}
