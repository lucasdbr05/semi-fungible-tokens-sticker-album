// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin implementations
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Lock is ERC1155, Ownable {
    using Strings for uint256;

    // Track total number of different figurinhas created
    uint256 public nextId = 1;

    // Base URI for metadata (e.g. IPFS)
    string public baseURI;

    // Map for rarity or supply limits (optional)
    mapping(uint256 => uint256) public maxSupply;
    mapping(uint256 => uint256) public minted;

    constructor(string memory _baseURI) ERC1155("") Ownable(msg.sender) {
        baseURI = _baseURI; // e.g. "ipfs://QmABC123/"
    }

    // Override tokenURI (returns the metadata link)
    function uri(uint256 _id) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI,"id_", _id.toString(), ".json"));
    }

    // Mint a new figurinha type (admin only)
    function createFigurinha(uint256 _amount, uint256 _maxSupply) external onlyOwner {
        uint256 id = nextId;
        nextId++;
        maxSupply[id] = _maxSupply;
        _mint(msg.sender, id, _amount, "");
        minted[id] = _amount;
    }

    // // Mint existing figurinha to someone (owner-controlled)
    // function mint(address to, uint256 id, uint256 amount) external onlyOwner {
    //     require(minted[id] + amount <= maxSupply[id], "Exceeds max supply");
    //     _mint(to, id, amount, "");
    //     minted[id] += amount; 
    // }

    // Optional: set a new base URI (if you move metadata)
    function setBaseURI(string memory newuri) external onlyOwner {
        baseURI = newuri;
    }

    // Price per pack in wei (0.001 ETH = 1000000000000000 wei)
    uint256 public packPrice = 0.001 ether;
    uint256 public stickersPerPack = 5;

    // Event for pack purchase
    event PackPurchased(address indexed buyer, uint256[] tokenIds, uint256 totalPaid);

    // Set pack price (owner only)
    function setPackPrice(uint256 _newPrice) external onlyOwner {
        packPrice = _newPrice;
    }

    // Set stickers per pack (owner only)
    function setStickersPerPack(uint256 _amount) external onlyOwner {
        stickersPerPack = _amount;
    }

    // Buy a pack of random stickers
    function buyPack() external payable {
        require(msg.value >= packPrice, "Insufficient payment");
        require(nextId > 1, "No stickers available yet");

        uint256[] memory purchasedIds = new uint256[](stickersPerPack);
        
        // Generate random sticker IDs
        for (uint256 i = 0; i < stickersPerPack; i++) {
            // Simple random generation (not production-ready, consider Chainlink VRF for real use)
            uint256 randomId = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i))) % (nextId - 1)) + 1;
            
            // Check if we can mint this sticker
            if (maxSupply[randomId] == 0 || minted[randomId] < maxSupply[randomId]) {
                _mint(msg.sender, randomId, 1, "");
                if (maxSupply[randomId] > 0) {
                    minted[randomId]++;
                }
                purchasedIds[i] = randomId;
            }
        }

        emit PackPurchased(msg.sender, purchasedIds, msg.value);

        // Refund excess payment
        if (msg.value > packPrice) {
            payable(msg.sender).transfer(msg.value - packPrice);
        }
    }

    // Withdraw contract balance (owner only)
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    // Get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}