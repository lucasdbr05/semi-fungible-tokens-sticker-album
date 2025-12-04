import { ethers } from "hardhat";
import contractInfo from "../../contract-info.json";

async function main() {
  const CONTRACT_ADDRESS = contractInfo.address;

  console.log("🔍 Verificando contrato em:", CONTRACT_ADDRESS);
  console.log();

  const Lock = await ethers.getContractFactory("Lock");
  const lock = Lock.attach(CONTRACT_ADDRESS) as any;

  try {
    // Obter informações básicas
    console.log("📊 Informações do Contrato:");

    const packPrice = await lock.packPrice();
    console.log("   Preço do Pacote:", ethers.formatEther(packPrice), "ETH");

    const stickersPerPack = await lock.stickersPerPack();
    console.log("   Figurinhas por Pacote:", stickersPerPack.toString());

    const nextId = await lock.nextId();
    console.log("   Próximo ID:", nextId.toString());
    console.log(
      "   Total de Tipos de Figurinhas:",
      (Number(nextId) - 1).toString()
    );

    const owner = await lock.owner();
    console.log("   Owner:", owner);

    const balance = await lock.getBalance();
    console.log("   Saldo do Contrato:", ethers.formatEther(balance), "ETH");

    console.log();
    console.log("✅ Contrato está funcionando corretamente!");
  } catch (error) {
    console.error("❌ Erro ao verificar contrato:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
