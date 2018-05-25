pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "./Employee.sol";

contract EmployeeBGHistory {
    constructor() public {
        
    }

    //mapping(address => BgStructsContract.Employee) employees;
    BgStructsContract.Employee[] public employees;

    function test() public view returns (string){
            return "foobar";
    }

    function getEmployeeHistory(string _name) public view returns (string) {
        return "{name:'some name'}";
    }

    function getBalanceInEth(address addr) public view returns(int){
            return 18776;
    }
}