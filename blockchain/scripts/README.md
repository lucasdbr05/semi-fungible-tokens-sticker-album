# 🎴 Scripts Úteis do Blockchain

Este diretório contém scripts para interagir com o smart contract.

## Scripts Disponíveis

### 1. deploy.ts
**Descrição**: Faz o deploy do contrato na rede Sepolia e cria figurinhas iniciais.

**Uso**:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

**O que faz**:
- Faz deploy do contrato Lock
- Cria 20 tipos diferentes de figurinhas
- Define suprimento inicial e máximo para cada
- Exibe o endereço do contrato deployado

### 2. interact.ts
**Descrição**: Script exemplo para interagir com um contrato já deployado.

**Uso**:
1. Edite o arquivo e substitua `CONTRACT_ADDRESS` pelo endereço do seu contrato
2. Execute:
```bash
npx hardhat run scripts/interact.ts --network sepolia
```

**O que faz**:
- Conecta ao contrato existente
- Mostra informações do contrato (preço, saldo, etc)
- Compra um pacote de figurinhas
- Mostra as figurinhas recebidas
- Consulta saldo de figurinhas específicas

## Outros Comandos Úteis

### Compilar Contratos
```bash
npx hardhat compile
```

### Rodar Testes
```bash
npx hardhat test
```

### Verificar Contrato no Etherscan
```bash
npx hardhat verify --network sepolia <ENDERECO_CONTRATO> "ipfs://QmYourIPFSHash/"
```

### Verificar Saldo da Conta
```bash
npx hardhat run scripts/checkBalance.ts --network sepolia
```

### Limpar Artefatos
```bash
npx hardhat clean
```

## Estrutura de um Script Hardhat

```typescript
import { ethers } from "hardhat";

async function main() {
  // Seu código aqui
  const [deployer] = await ethers.getSigners();
  console.log("Conta:", await deployer.getAddress());
  
  // ... rest of your script
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Dicas

1. **Sempre teste primeiro na rede local** antes de fazer deploy na Sepolia
2. **Guarde o endereço do contrato** após o deploy
3. **Verifique o contrato no Etherscan** para transparência
4. **Use eventos** para rastrear transações importantes
5. **Teste com pequenas quantidades** primeiro

## Resolução de Problemas

### "Error: insufficient funds"
- Certifique-se de ter ETH suficiente na conta
- Obtenha ETH de teste em https://sepoliafaucet.com/

### "Error: nonce too high"
- Resete sua conta no MetaMask: Settings > Advanced > Clear activity tab data

### "Error: cannot estimate gas"
- Verifique se os parâmetros da transação estão corretos
- Certifique-se de estar na rede correta

### "Error: contract not deployed"
- Verifique se o endereço do contrato está correto
- Confirme se o deploy foi bem-sucedido
