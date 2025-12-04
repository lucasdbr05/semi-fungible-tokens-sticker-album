import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Iniciando deploy do contrato Lock na Sepolia...\n");

  // Substitua pela sua URI do IPFS ou servidor de metadados
  const baseURI = "ipfs://QmYourIPFSHash/";

  console.log("📝 Base URI:", baseURI);
  
  const Lock = await ethers.getContractFactory("Lock");
  console.log("⏳ Fazendo deploy do contrato...");
  
  const lock = await Lock.deploy(baseURI);
  await lock.waitForDeployment();

  const address = await lock.getAddress();
  console.log(`✅ Contrato Lock deployed em: ${address}\n`);
  
  // Criar algumas figurinhas de exemplo
  console.log("🎴 Criando figurinhas de exemplo...");
  
  const numStickers = 20; // Número de tipos diferentes de figurinhas
  const initialSupply = 50; // Quantidade inicial mintada de cada
  const maxSupply = 500; // Suprimento máximo de cada figurinha
  
  for (let i = 1; i <= numStickers; i++) {
    process.stdout.write(`   Criando figurinha ${i}/${numStickers}...`);
    const tx = await lock.createFigurinha(initialSupply, maxSupply);
    await tx.wait();
    process.stdout.write(" ✓\n");
  }

  console.log("\n=== ✨ CONFIGURAÇÃO CONCLUÍDA ===\n");
  console.log(`📍 Endereço do Contrato: ${address}`);
  console.log(`🔗 Explorador: https://sepolia.etherscan.io/address/${address}`);
  console.log(`💰 Preço do Pacote: 0.001 ETH`);
  console.log(`🎴 Figurinhas por Pacote: 5`);
  console.log(`📦 Total de Tipos de Figurinhas: ${numStickers}`);
  
  console.log("\n=== 📋 PRÓXIMOS PASSOS ===\n");
  console.log("1. Copie o endereço do contrato acima");
  console.log("2. Abra o arquivo: my-app/app/loja/page.tsx");
  console.log(`3. Substitua "SEU_ENDERECO_DO_CONTRATO_AQUI" por: ${address}`);
  console.log("4. Acesse a loja no frontend e comece a comprar figurinhas!");
  console.log("\n💡 Dica: Você pode obter ETH de teste em https://sepoliafaucet.com/\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro durante o deploy:", error);
    process.exit(1);
  });
