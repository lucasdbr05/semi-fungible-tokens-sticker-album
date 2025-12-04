import { ethers } from "hardhat";

/**
 * Script para interagir com o contrato Lock já deployado
 * Útil para testar funcionalidades após o deploy
 */

async function main() {
  // Substitua pelo endereço do seu contrato deployado
  const CONTRACT_ADDRESS = "0x...";
  
  // ABI do contrato (você pode copiar do arquivo de artifacts após compilar)
  const Lock = await ethers.getContractFactory("Lock");
  const lock = Lock.attach(CONTRACT_ADDRESS);

  console.log("🔗 Conectado ao contrato em:", CONTRACT_ADDRESS);
  console.log();

  // Obter informações do contrato
  const packPrice = await lock.packPrice();
  const stickersPerPack = await lock.stickersPerPack();
  const nextId = await lock.nextId();
  const contractBalance = await lock.getBalance();

  console.log("📊 Informações do Contrato:");
  console.log("   Preço do Pacote:", ethers.formatEther(packPrice), "ETH");
  console.log("   Figurinhas por Pacote:", stickersPerPack.toString());
  console.log("   Próximo ID:", nextId.toString());
  console.log("   Total de Tipos:", (nextId - BigInt(1)).toString());
  console.log("   Saldo do Contrato:", ethers.formatEther(contractBalance), "ETH");
  console.log();

  // Obter signer (conta que vai fazer as transações)
  const [signer] = await ethers.getSigners();
  console.log("👤 Conta atual:", await signer.getAddress());
  console.log();

  // Exemplo: Comprar um pacote
  console.log("🛒 Comprando um pacote de figurinhas...");
  try {
    const tx = await lock.connect(signer).buyPack({ value: packPrice });
    console.log("   Transação enviada:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("   ✅ Transação confirmada!");
    
    // Encontrar o evento PackPurchased
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsed = lock.interface.parseLog(log);
        return parsed?.name === "PackPurchased";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = lock.interface.parseLog(event);
      const tokenIds = parsed?.args.tokenIds;
      console.log("   🎴 Figurinhas recebidas:", tokenIds.map((id: any) => id.toString()).join(", "));
    }
  } catch (error) {
    console.error("   ❌ Erro ao comprar pacote:", error);
  }
  console.log();

  // Obter saldo de uma figurinha específica
  const figurinhaId = 1;
  const balance = await lock.balanceOf(await signer.getAddress(), figurinhaId);
  console.log(`📦 Quantidade da figurinha #${figurinhaId}:`, balance.toString());
  console.log();

  // Obter URI de metadados
  const uri = await lock.uri(figurinhaId);
  console.log(`🔗 URI da figurinha #${figurinhaId}:`, uri);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
