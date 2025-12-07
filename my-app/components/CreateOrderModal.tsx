"use client";

import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateOrderModal({ isOpen, onClose }: Props) {
  const [maker, setMaker] = useState("");
  const [tokenGive, setTokenGive] = useState("");
  const [tokenIdGive, setTokenIdGive] = useState("");
  const [amountGive, setAmountGive] = useState("");
  const [tokenWant, setTokenWant] = useState("");
  const [tokenIdWant, setTokenIdWant] = useState("");
  const [amountWant, setAmountWant] = useState("");
  const [taker, setTaker] = useState("");
  const [deadline, setDeadline] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: any) {
    e.preventDefault();

    await addDoc(collection(db, "orders"), {
      maker,
      tokenGive,
      tokenIdGive: tokenIdGive.split(",").map(Number),
      amountGive: amountGive.split(",").map(Number),
      tokenWant,
      tokenIdWant: tokenIdWant.split(",").map(Number),
      amountWant: amountWant.split(",").map(Number),
      taker: taker || "0x0000000000000000000000000000000000000000",
      nonce: Math.floor(Math.random() * 1e18),
      deadline: new Date(deadline).getTime(),
      createdAt: serverTimestamp(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Criar Nova Order
        </h2>

        <div className="space-y-3">
          <input className="input" placeholder="Maker" value={maker} onChange={e => setMaker(e.target.value)} />

          <input className="input" placeholder="Token Give" value={tokenGive} onChange={e => setTokenGive(e.target.value)} />

          <input className="input" placeholder="TokenId Give (ex: 1,3,5)" value={tokenIdGive} onChange={e => setTokenIdGive(e.target.value)} />

          <input className="input" placeholder="Amounts Give (ex: 1,1,2)" value={amountGive} onChange={e => setAmountGive(e.target.value)} />

          <input className="input" placeholder="Token Want" value={tokenWant} onChange={e => setTokenWant(e.target.value)} />

          <input className="input" placeholder="TokenId Want (ex: 2,4)" value={tokenIdWant} onChange={e => setTokenIdWant(e.target.value)} />

          <input className="input" placeholder="Amounts Want (ex: 1,2)" value={amountWant} onChange={e => setAmountWant(e.target.value)} />

          <input className="input" placeholder="Taker (opcional)" value={taker} onChange={e => setTaker(e.target.value)} />

          <input type="datetime-local" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} />

          <button className="w-full bg-green-600 text-white rounded-xl p-3">
            Criar Order
          </button>

          <button
            type="button"
            className="w-full bg-gray-200 p-3 rounded-xl"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
