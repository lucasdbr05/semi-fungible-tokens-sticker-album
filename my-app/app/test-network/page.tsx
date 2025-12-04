"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function TestNetwork() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        if (typeof window.ethereum === "undefined") {
          setInfo({ error: "MetaMask não detectado" });
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        
        setInfo({
          chainId: network.chainId.toString(),
          chainIdBigInt: network.chainId,
          name: network.name,
          isSepolia: network.chainId === BigInt(11155111),
          sepoliaChainId: BigInt(11155111).toString()
        });
      } catch (err: any) {
        setInfo({ error: err.message });
      }
    };

    checkNetwork();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Diagnóstico de Rede</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  );
}
