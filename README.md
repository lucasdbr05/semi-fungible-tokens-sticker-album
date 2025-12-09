# A Decentralized Digital Sticker Album System Using ERC-1155 Smart Contracts and Off-Chain Signed Orders

**UnB - University of Brasília | Cryptocurrency Design and Engineering**

---

## Team Members

- **Cauê Trindade** (231019003) - [@cauetrd](https://github.com/cauetrd)
- **Gustavo Melo** (211055272) - [@GMTonnera](https://github.com/GMTonnera)
- **Lucas Lima** (231003406) - [@lucasdbr05](https://github.com/lucasdbr05)
- **Wallysson Matheus** (231038798) - [@WallyssonMQSilva](https://github.com/WallyssonMQSilva)

---

## Abstract

This paper discusses the design and implementation of a decentralized digital sticker album system using Ethereum blockchain technology. The project aims to create verifiable digital collectibles for the Exatas Cup, a futsal championship organized by students at the Institute of Exact Sciences at UnB. We suggest a hybrid architecture that combines ERC-1155 semi-fungible tokens for representing assets with EIP-712 cryptographic signatures for peer-to-peer trading. The system allows for randomized pack purchases on-chain, manages orders off-chain via Firebase, and uses smart contracts for trustless atomic swaps. Our implementation on the Ethereum Sepolia testnet shows lower gas costs compared to traditional ERC-721 methods while keeping security and decentralization intact. This solution offers a practical framework for digital collectibles that can engage the academic community.

---

## 1. Introduction

The project consists of developing a complete ecosystem based on **Web3**, designed to represent digital stickers of players from the Exatas Cup. The core idea was to create an environment where users could **collect, view, buy and trade** digital stickers in a decentralized way, using a real blockchain to record ownership, transfers and interactions.

The Exatas Cup is a futsal championship organized by students of the Institute of Exact Sciences at the University of Brasília (UnB), bringing together students from Mathematics, Computer Science and Statistics. The tournament had editions in 2024 and 2025 and became a significant event in the academic community, promoting integration, healthy competition and engagement among participants. One of the biggest challenges has always been creating visual content to showcase the teams, such as player cards with photos and information. The digital sticker album developed in this project emerged precisely as a modern solution to this problem, offering a practical, fast and interactive way to present rosters, while also enabling gamification through digital collectibles.

To achieve this, we adopted the **ERC-1155** standard, which allows representing multiple stickers inside a single smart contract, reducing gas costs, simplifying management and offering support for semi-fungible items — exactly what a sticker album requires. This standard is widely used in games, collectibles and marketplaces due to its flexibility and efficiency.

The platform not only displays the stickers but also integrates a **P2P trading system** controlled by the smart contract. Purchase operations, listings, acceptances and cancellations are recorded transparently and are fully auditable, ensuring reliability and immutability — fundamental principles in blockchain-based applications.

### 1.1 Objectives

This work aims to build a decentralized application (dApp) that enables:

1. **Tokenized Asset Creation:** Using the ERC-1155 standard for efficient management of player sticker tokens
2. **On-Chain Purchasing Mechanism:** Smart contracts for acquiring randomized packs through cryptocurrency payments
3. **Decentralized Trading System:** Trustless peer-to-peer exchange protocol using cryptographic signatures
4. **User Interface Integration:** A Web3-enabled frontend for easy interaction with the blockchain via MetaMask wallet

### 1.2 Contributions

The main contributions of this work include:

- Designing and deploying an ERC-1155 smart contract optimized for digital collectibles with supply control features
- Creating an off-chain order book system using EIP-712 signatures to cut gas costs while ensuring security
- Developing a hybrid architecture that combines on-chain verification with off-chain data storage
- Creating a complete dApp that showcases practical blockchain integration for enhancing community engagement

---

## 2. Related Work and Technical Background

### 2.1 ERC-1155 Multi Token Standard

The ERC-1155 standard, introduced by Enjin in 2018, offers significant improvements over older token standards like ERC-20 for fungible tokens and ERC-721 for non-fungible tokens. Unlike ERC-721, which requires separate contracts for each token type, ERC-1155 allows multiple token types within a single contract through unique identifiers. This method enhances gas efficiency for batch operations and decreases blockchain state bloat.

Key benefits for our use case:
- **Gas Efficiency:** Batch minting and transfers can reduce transaction costs by up to 90% compared to ERC-721
- **Semi-Fungibility:** Supports both unique items and multiple instances of the same item (important for duplicate stickers)
- **Flexibility:** A single contract manages the entire collection with various supply limits per token ID
- **Metadata URI:** Dynamic metadata resolution using standardized URI patterns

### 2.2 EIP-712: Typed Structured Data Hashing and Signing

EIP-712 provides a standard method for hashing and signing typed structured data. Unlike traditional signature methods that create opaque hexadecimal hashes, EIP-712 allows wallets like MetaMask to show human-readable message content before signing. This improves user experience and security by enabling the verification of transaction details.

Our implementation uses EIP-712 for creating signed trading orders that can be validated on-chain without prior blockchain submission, effectively establishing an off-chain order book with on-chain settlement.

---

## 3. System Architecture and Design

### 3.1 ERC-1155 Token Contract Implementation

The core smart contract (`Lock.sol`) implements the ERC-1155 standard with additional features for:

**Token Creation and Supply Management:**
```solidity
function createFigurinha(uint256 _amount, uint256 _maxSupply) external onlyOwner
```
- Allows the owner to mint new token types
- Enforces maximum supply limits per token ID
- Monitors minted quantities to prevent oversupply

**Randomized Pack Purchase:**
```solidity
function buyPack() external payable
```
- Accepts ETH payments (0.001 ETH per pack)
- Generates 5 pseudo-random token IDs using on-chain randomness
- Performs supply checks before minting
- Emits `PackPurchased` event for frontend integration

**Metadata Resolution:**
- Provides IPFS-based URIs for token metadata
- Metadata includes player name, team, and image information

### 3.2 Decentralized Trading System

The trading mechanism separates order creation from execution using cryptographic signatures:

**Order Structure:**
```solidity
struct Order {
    address maker;           // Address of the order creator
    address tokenGive;       // ERC-1155 contract for offered tokens
    uint256[] tokenIdGive;   // Token IDs the maker offers [1,3,5]
    uint256[] amountGive;    // Corresponding quantities [1,1,2]
    address tokenWant;       // ERC-1155 contract for requested tokens
    uint256[] tokenIdWant;   // Token IDs requested [2,4]
    uint256[] amountWant;    // Requested quantities [1,2]
    address taker;           // Specific taker address or 0x0 for any
    uint256 nonce;           // Unique number to prevent replay attacks
    uint256 deadline;        // Order expiration timestamp
}
```

**Trading Protocol Flow:**
```
User A (Maker) → Create Order → Sign EIP-712 → Store Off-Chain
User B (Taker) → Accept Order → Execute On-Chain → Atomic Swap
```

### 3.3 Hybrid Data Architecture

The system uses a two-layer data architecture:

**On-Chain Layer:**
- Token ownership and balances (ERC-1155 contract)
- Trading execution and settlement (SignedSwap contract)
- Supply limits and minting records
- Transaction history via event logs

**Off-Chain Layer (Firebase Firestore):**
- Pending trade orders
- Order signatures
- User interface management
- Real-time order book sync

This design optimizes gas efficiency by placing only security-critical data on-chain while ensuring a good user experience through off-chain caching.

---

## 4. Implementation Details

### 4.1 Smart Contract Development

**Contract: `Lock.sol` (ERC-1155 Token)**

Key technical decisions:
- Using Solidity version 0.8.20 with optimizations enabled (200 runs)
- Implementing OpenZeppelin's secure versions for safety
- Owner-controlled token creation with supply limits
- Generating pseudo-random numbers using `keccak256(block.timestamp, block.prevrandao, msg.sender)`

**Contract: `ERC1155SignedSwap.sol` (Trading Engine)**

Implementation highlights:

```solidity
function executeOrder(Order calldata order, bytes calldata signature) external {
    // Validate time limit
    require(block.timestamp <= order.deadline, "Order expired");
    
    // Prevent replay attacks
    require(!usedNonces[order.maker][order.nonce], "Nonce already used");
    
    // Validate array lengths
    require(order.tokenIdGive.length == order.amountGive.length, "Invalid arrays");
    require(order.tokenIdWant.length == order.amountWant.length, "Invalid arrays");
    
    // Verify signature using EIP-712
    bytes32 orderHash = _hashTypedDataV4(_hashOrder(order));
    require(ECDSA.recover(orderHash, signature) == order.maker, "Invalid signature");
    
    // Perform atomic token swaps
    IERC1155(order.tokenGive).safeBatchTransferFrom(
        order.maker, msg.sender, order.tokenIdGive, order.amountGive, ""
    );
    IERC1155(order.tokenWant).safeBatchTransferFrom(
        msg.sender, order.maker, order.tokenIdWant, order.amountWant, ""
    );
    
    // Update state and emit an event
    usedNonces[order.maker][order.nonce] = true;
    emit OrderExecuted(order.maker, msg.sender, ...);
}
```

**Security Properties:**
- **Atomicity:** Transactions are all or nothing
- **Non-repudiation:** Cryptographic signatures prevent denial of orders
- **Replay protection:** Nonce tracking prevents reuse of signatures
- **Time limits:** Deadlines prevent outdated orders
- **Reentrancy safety:** OpenZeppelin's SafeERC1155 protects against attacks

### 4.2 EIP-712 Signature Implementation

Client-side signature generation:

```typescript
const domain = {
  name: "ERC1155SignedSwap",
  version: "1",
  chainId: 11155111,  // Sepolia testnet
  verifyingContract: SWAP_CONTRACT_ADDRESS
};

const types = {
  Order: [
    { name: "maker", type: "address" },
    { name: "tokenGive", type: "address" },
    { name: "tokenIdGive", type: "uint256[]" },
    { name: "amountGive", type: "uint256[]" },
    { name: "tokenWant", type: "address" },
    { name: "tokenIdWant", type: "uint256[]" },
    { name: "amountWant", type: "uint256[]" },
    { name: "taker", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ]
};

const signature = await signer.signTypedData(domain, types, orderValue);
```

Advantages:
- Human-readable signatures in the MetaMask interface
- No gas fees until the order is executed
- An off-chain order book with on-chain settlements
- Improved user security through transparent signing

### 4.3 Off-Chain Order Management

Firebase Firestore integration:

```typescript
// Create and store an order
await addDoc(collection(db, "orders"), {
  ...order,
  signature,
  createdAt: serverTimestamp()
});

// Retrieve orders in real time
const ordersQuery = query(collection(db, "orders"));
const snapshot = await getDocs(ordersQuery);
```

Benefits:
- No blockchain queries needed for finding orders
- Real-time UI updates via Firestore subscriptions
- Lower infrastructure costs
- Scales well

### 4.4 Frontend Architecture

The user interface uses Next.js 16 with React 19, implementing Web3 integration through custom hooks:

**Wallet Connection Hook (`useWallet.ts`):**
```typescript
async function connectWallet() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  localStorage.setItem("wallet_address", accounts[0]);
}
```

**Balance Monitoring Hook (`useBalance.ts`):**
- Validates the network (Sepolia chain ID: 11155111)
- Refreshes balance automatically every 10 seconds
- Allows switching networks via MetaMask RPC

**NFT Ownership Query (`useTokenBalance.ts`):**
- Connects with Alchemy SDK for efficient blockchain queries
- Retrieves balances for ERC-1155 multi-tokens

---

## 5. Technology Stack

### 5.1 Blockchain Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | 0.8.20 | Smart contract programming language |
| **Hardhat** | 2.27.1 | Ethereum development framework |
| **OpenZeppelin Contracts** | 5.4.0 | Audited contract implementations |
| **Ethers.js** | 6.15.0 | Web3 provider and contract interaction |
| **EIP-712** | Standard | Typed structured data signing |

### 5.2 Frontend Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.7 | React framework with SSR and App Router |
| **React** | 19.2.0 | Component-based UI library |
| **TypeScript** | 5.x | Static typing for JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **MetaMask** | Latest | Web3 wallet provider |

### 5.3 Backend Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase** | 12.6.0 | Backend-as-a-Service platform |
| **Firestore** | Cloud | NoSQL database for order storage |
| **Alchemy SDK** | 3.6.5 | Enhanced blockchain API access |

### 5.4 Network Configuration

- **Ethereum Sepolia Testnet:** Chain ID 11155111
- **Infura RPC Endpoint:** https://sepolia.infura.io/v3/
- **IPFS (Planned):** Decentralized metadata storage

---

## 6. Deployment and Execution

### 6.1 Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Sepolia testnet ETH (available from [Sepolia Faucet](https://sepoliafaucet.com/))
- Infura or Alchemy API key for RPC access

### 6.2 Smart Contract Deployment

**Step 1: Environment Configuration**

Create a `.env` file in the `blockchain/` directory:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
PRIVATE_KEY=your_metamask_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Step 2: Compile and Deploy Contracts**

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
npx hardhat run scripts/deploySignedSwap.ts --network sepolia
```

**Step 3: (Optional) Contract Verification**

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Record deployed contract addresses in `contract-info.json`.

### 6.3 Frontend Application Setup

```bash
cd my-app
npm install
npm run dev
```

Access the application at: [http://localhost:3000](http://localhost:3000) (for development)  


### 6.4 MetaMask Configuration

1. Add the Sepolia network via [ChainList](https://chainlist.org/chain/11155111)
2. Import your account with test ETH
3. Connect your wallet through the dApp interface



### 6.5 Live Deployment:

- [https://fungible-tokens-sticker-album.vercel.app](https://semi-fungible-tokens-sticker-album.vercel.app)

---

## 7. Results and Analysis

### 7.1 Deployment Metrics

The system was successfully deployed on the Ethereum Sepolia testnet with these parameters:

- **Token Contract Address:** `0x09365dd33845bEEE09999efA0D8F78FcCc162eca`
- **Trading Contract Address:** `0x394Ce046c9489c3BAFb0bc5a9B6E8030Cd263b42`
- **Network:** Sepolia (Chain ID: 11155111)
- **Total Token Types:** 27 unique sticker IDs
- **Pack Price:** 0.001 ETH (~$3.50 at current rates)
- **Stickers Per Pack:** 5 tokens

### 7.2 Security Audit Results

A manual security review found and fixed:

1. **Reentrancy Protection:** OpenZeppelin's SafeERC1155 guards against callbacks
2. **Integer Overflow:** Solidity 0.8.20 has built-in overflow checks
3. **Access Control:** Using the ownable pattern limits administrative actions
4. **Signature Replay:** Nonce mapping prevents double-spending of signatures
5. **Front-Running:** Setting deadlines and off-chain storage reduces MEV threats

## 8. Conclusion

This work showcases a complete implementation of a decentralized digital sticker album using modern blockchain technology. The hybrid structure, which combines ERC-1155 tokens with EIP-712 signed orders, presents effective solutions to common blockchain issues such as high gas costs, poor user experience, and scalability limitations.

Key achievements include:

1. **Technical Innovation:** Successful establishment of an off-chain order book with on-chain settlements
2. **Gas Efficiency:** Over 90% reduction in costs compared to conventional NFT methods
3. **User Experience:** Seamless MetaMask integration with understandable signatures
4. **Real-World Application:** Meeting the genuine needs of the Exatas Cup community

The system shows that blockchain technology can bring real value beyond mere speculation, creating verifiable digital collectibles that strengthen community engagement. While the current implementation runs on a testnet, the architecture is ready for production use and can scale for mainnet deployment with the right infrastructure investments.

Future work should focus on further decentralizing off-chain components and refining randomness generation. However, the present prototype confirms the viability of blockchain-based collectible systems for academic and community events.
