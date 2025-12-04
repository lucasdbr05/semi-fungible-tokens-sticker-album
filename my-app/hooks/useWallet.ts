"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (err) {
      console.error("Erro ao conectar carteira:", err);
    }
  }

  function disconnectWallet() {
    setAddress(null);
  }

  return {
    address,
    isLogged: !!address,
    connectWallet,
    disconnectWallet,
  };
}
