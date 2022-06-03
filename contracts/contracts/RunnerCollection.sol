//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RunnerCollection is ERC1155 {

    string public name;
    string public symbol; 
    uint256 public tokenCount;
    string public baseUri; // baseUri is a link that `points` to our NFT collection which are uploaded on ipfs.

    constructor(string memory _name, string memory _symbol, string memory _baseUri) ERC1155(_baseUri) {
        name = _name;
        symbol = _symbol;
        baseUri = _baseUri;
    }

    // we need to override the uri function so our nfts are compatible with `opensea`
    function uri(uint256 _tokenId) override public view returns(string memory) {
        return string (
            abi.encodePacked(
                baseUri,
                Strings.toString(_tokenId), // `Strings.` is taken from openzeppelin as solidity doesn't work well with strings
                ".json"
            )
        );
    }
    
    // Below `mint()` is called from the frontend by the player using their NFT score(i.e `amount` in below function)
    function mint(uint256 amount) public {
        tokenCount += 1; // increasing the token count as we are minting NFT.
        _mint(msg.sender, tokenCount, amount, "");
    }
}
