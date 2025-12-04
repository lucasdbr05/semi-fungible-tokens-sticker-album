"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function useBalance(address: string | null) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);

      try {
        if (typeof window.ethereum === "undefined") {
          throw new Error("MetaMask não detectado");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Verificar se estamos na rede Sepolia (chainId 11155111)
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(11155111)) {
          setWrongNetwork(true);
          throw new Error("Por favor, conecte-se à rede Sepolia");
        }
        setWrongNetwork(false);

        const rawBalance = await provider.getBalance(address);
        const ethBalance = ethers.formatEther(rawBalance);
        
        setBalance(Number(ethBalance).toFixed(6));
      } catch (err) {
        console.error("Erro ao buscar saldo:", err);
        setError(err instanceof Error ? err.message : "Erro ao buscar saldo");
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Atualizar saldo a cada 10 segundos
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [address]);

  const refresh = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask não detectado");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const rawBalance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(rawBalance);
      
      setBalance(Number(ethBalance).toFixed(6));
    } catch (err) {
      console.error("Erro ao atualizar saldo:", err);
      setError(err instanceof Error ? err.message : "Erro ao atualizar saldo");
    } finally {
      setLoading(false);
    }
  };

  const switchToSepolia = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask não detectado");
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 11155111 em hexadecimal
      });
      
      setWrongNetwork(false);
      setError(null);
      
      // Atualizar saldo após trocar de rede
      setTimeout(refresh, 1000);
    } catch (err) {
      // Se a rede não estiver adicionada, tentar adicionar
      if (err instanceof Error && 'code' in err && (err as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]
          });
          setTimeout(refresh, 1000);
        } catch (addError) {
          console.error("Erro ao adicionar rede:", addError);
          setError("Não foi possível adicionar a rede Sepolia");
        }
      } else {
        console.error("Erro ao trocar de rede:", err);
        setError(err instanceof Error ? err.message : "Erro ao trocar de rede");
      }
    }
  };

  return {
    balance,
    loading,
    error,
    wrongNetwork,
    refresh,
    switchToSepolia,
  };
}
