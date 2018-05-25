pragma solidity ^0.4.23;

library UniqueId {

    /**
    * @dev Generate a unique ID that looks like an Ethereum address
    *
    * Sample: 0xf4a8f74879182ff2a07468508bec89e1e7464027		          
    */  
    function getUniqueId() public view returns (address) 
    {

        bytes20 b = bytes20(keccak256(msg.sender, now));
        uint addr = 0;
        for (uint index = b.length-1; index+1 > 0; index--) {
            addr += uint(b[index]) * ( 16 ** ((b.length - index - 1) * 2));
        }

        return address(addr);
    }
}