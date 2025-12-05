// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";


/* How it works explained by Cauezin semi drunk:
    Say user A wants to swap a bunch of tokens, say set TA of {tokenId,quantity} for set TB of maybe diferent TokenIds or quantitys.
    Then A creates an order specifying everything as it is bellow, and signs it.
    That means: I'm A and I agree to swap tokens with anyone (or maybe someone specific but whateva) that is willing to give me TB to receive TA.
    Anyone that has the order and it's signature, can then call the contract to execute this swap.
    A gives their consent by signing it, and B gives their by calling the contract.
    If the swap is possible: Sign is valid, nonces are valid, date is valid, both users have the tokens they are giving, it happens 
 */

contract ERC1155SignedSwap is EIP712 {
    using ECDSA for bytes32;

    constructor() EIP712("ERC1155SignedSwap", "1") {}

    // Tracks used nonces for makers
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    event OrderExecuted(
        address indexed maker,
        address indexed taker,
        address tokenGive,
        uint256[] tokenIdGive,
        uint256[] amountGive,
        address tokenWant,
        uint256[] tokenIdWant,
        uint256[] amountWant
    );

    struct Order {
        address maker;          //A
        address tokenGive;      //Token contract - could be array but its single as every token should come from the album contract
        uint256[] tokenIdGive;  //A gives
        uint256[] amountGive;   //
        address tokenWant;      
        uint256[] tokenIdWant;  //A receives
        uint256[] amountWant;
        address taker;          //Optional: if set to 0x, anyone can claim. else, only taker
        uint256 nonce;          //Used to prevent reuse
        uint256 deadline;       //Sets time limit 
    }

    bytes32 private constant ORDER_TYPEHASH = keccak256(
        "Order(address maker,address tokenGive,bytes32 tokenIdGiveHash,bytes32 amountGiveHash,address tokenWant,bytes32 tokenIdWantHash,bytes32 amountWantHash,address taker,uint256 nonce,uint256 deadline)"
    );

    function _hashOrder(Order calldata order) internal view returns (bytes32) {
        bytes32 tokenIdGiveHash = keccak256(abi.encodePacked(order.tokenIdGive));
        bytes32 amountGiveHash = keccak256(abi.encodePacked(order.amountGive));
        bytes32 tokenIdWantHash = keccak256(abi.encodePacked(order.tokenIdWant));
        bytes32 amountWantHash = keccak256(abi.encodePacked(order.amountWant));

        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    ORDER_TYPEHASH,
                    order.maker,
                    order.tokenGive,
                    tokenIdGiveHash,
                    amountGiveHash,
                    order.tokenWant,
                    tokenIdWantHash,
                    amountWantHash,
                    order.taker,
                    order.nonce,
                    order.deadline
                )
            )
        );
    }

    function executeOrder(Order calldata order, bytes calldata signature) external {
        require(block.timestamp <= order.deadline, "Order expired");
        require(!usedNonces[order.maker][order.nonce], "Nonce already used");

        require(order.tokenIdGive.length == order.amountGive.length, "Bad give array length");
        require(order.tokenIdWant.length == order.amountWant.length, "Bad want array length");

        if (order.taker != address(0)) {
            require(msg.sender == order.taker, "Not authorized taker");
        }

        // Hash the full order
        bytes32 hash = _hashOrder(order);

        // Verify signature
        require(ECDSA.recover(hash, signature) == order.maker, "Invalid signature");

        // Mark nonce as used
        usedNonces[order.maker][order.nonce] = true;

        // Perform batched ERC-1155 transfers
        IERC1155(order.tokenGive).safeBatchTransferFrom(
            order.maker,
            msg.sender,
            order.tokenIdGive,
            order.amountGive,
            ""
        );

        IERC1155(order.tokenWant).safeBatchTransferFrom(
            msg.sender,
            order.maker,
            order.tokenIdWant,
            order.amountWant,
            ""
        );

        emit OrderExecuted(
            order.maker,
            msg.sender,
            order.tokenGive,
            order.tokenIdGive,
            order.amountGive,
            order.tokenWant,
            order.tokenIdWant,
            order.amountWant
        );
    }
}
