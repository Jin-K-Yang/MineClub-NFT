// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MineClub is ERC1155Supply, Ownable {
    using Strings for uint256;

    string public baseURI;
    mapping(uint256 => bool) public validTypeIds;

    uint256 maxPerTx = 2;
    uint256 mintPrice = 10**17;
    uint256 maxTotalSupply = 5000;

    constructor() ERC1155("") {}

    /**
     * owner only
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setValidTypeId(uint256 _typeId, bool _valid) external onlyOwner {
        validTypeIds[_typeId] = _valid;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(_msgSender()).call{value: balance}("");
    }

    /**
     * public
     */
    function mint(uint256 _id, uint256 _quantity) external payable {
        require(validTypeIds[_id], "Valid: Not valid id");

        require(
            msg.value == _quantity * mintPrice,
            "Purchase: Incorrect payment"
        );

        require(
            _quantity <= maxPerTx,
            "Purchase: Exceed the limitation of per transaction"
        );

        require(
            totalSupply(_id) + _quantity <= maxTotalSupply,
            "Purchase: Max total supply exceeded"
        );

        _mint(_msgSender(), _id, _quantity, "");
    }

    function uri(uint256 id) public view override returns (string memory) {
        require(validTypeIds[id], "Valid: Not valid id");

        return string(abi.encodePacked(baseURI, id.toString()));
    }
}
