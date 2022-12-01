// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

//Lets import some openzeplin contract

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyNFT is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //We need to pass the name of out NFs token and its symbol

    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("MY NFTContract");
    }

    //A function our users will hit to get their NFT
    function makeAnEpicNFT() public {
        //Get the current tokeinId, this starts at 0
        uint256 newItemId = _tokenIds.current();
        //Actually mint the NFT to the sender using msg.sender

        _safeMint(msg.sender, newItemId);

        //Set the NFtsdata
        _setTokenURI(newItemId, "blahu");

        //Incremnt the counter for when the next NFT is minted
        _tokenIds.increment();
    }
}
