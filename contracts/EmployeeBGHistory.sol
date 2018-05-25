pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "./Employee.sol";

contract EmployeeBGHistory {
    constructor() public {
        
    }

    //mapping(address => BgStructsContract.Employee) employees;
    BgStructsContract.Employee[] public employees;

    function test() public pure returns (string){
            return "foobar";
    }

    function getEmployeeHistory(string _name) public pure returns (BgStructsContract.Employee) {
        return BgStructsContract.Employee({name: _name, id: 1, age: 12, communicationAddress: "some address"});
    }
}