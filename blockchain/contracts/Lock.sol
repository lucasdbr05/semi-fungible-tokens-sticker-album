pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Lock is ERC1155, Ownable {
    using Strings for uint256;

    uint256 public nextId = 1;

    string public baseURI;

    mapping(uint256 => uint256) public maxSupply;
    mapping(uint256 => uint256) public minted;

    constructor(string memory _baseURI) ERC1155("") Ownable(msg.sender) {
        baseURI = _baseURI; // e.g. "ipfs://QmABC123/"
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI,"id_", _id.toString(), ".json"));
    }

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

    function setBaseURI(string memory newuri) external onlyOwner {
        baseURI = newuri;
    }

    uint256 public packPrice = 0.001 ether;
    uint256 public stickersPerPack = 5;

    event PackPurchased(address indexed buyer, uint256[] tokenIds, uint256 totalPaid);

    function setPackPrice(uint256 _newPrice) external onlyOwner {
        packPrice = _newPrice;
    }

    function setStickersPerPack(uint256 _amount) external onlyOwner {
        stickersPerPack = _amount;
    }

    function buyPack() external payable {
        require(msg.value >= packPrice, "Insufficient payment");
        require(nextId > 1, "No stickers available yet");

        uint256[] memory purchasedIds = new uint256[](stickersPerPack);
        
        for (uint256 i = 0; i < stickersPerPack; i++) {
            uint256 randomId = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i))) % (nextId - 1)) + 1;
            
            if (maxSupply[randomId] == 0 || minted[randomId] < maxSupply[randomId]) {
                _mint(msg.sender, randomId, 1, "");
                if (maxSupply[randomId] > 0) {
                    minted[randomId]++;
                }
                purchasedIds[i] = randomId;
            }
        }

        emit PackPurchased(msg.sender, purchasedIds, msg.value);

        if (msg.value > packPrice) {
            payable(msg.sender).transfer(msg.value - packPrice);
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}