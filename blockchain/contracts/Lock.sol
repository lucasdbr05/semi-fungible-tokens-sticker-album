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
        return string(abi.encodePacked(baseURI, _id.toString(), ".json"));
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

    function trade(){
      _transfer(from, to, id, amount);
    }
    function buyPack(){

    }
}