pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "./Employee.sol";

contract EmployeeBGHistory {
    constructor() public {
        
    }

    //mapping(address => BgStructsContract.Employee) employees;
    BgStructsContract.Employee[] public employees;

   

    function getEmployeeHistory(string _name) public view returns (string) {
<<<<<<< HEAD
        // var obj= {"name":"some name", "name1":"some name1"};
            
        return _name;
    }

    function getEmployeeCount() public view returns (uint) {
       return employees.length;
    }

     function getEmployeeCountLoop() public view returns (uint) {
         uint count = 0;
        //string[]  emp;
        for(uint i = 0; i < 10; i++) {
            count++;
        }
        return count;
    }


    function AddUpdateEmployeeHistory(byte _id,string _name) public view returns (bool) {
        var isEmployeeExists = false;
        for(uint i = 0; i < employees.length; i++) {
            if (employees[i].id == _id) {
                isEmployeeExists= true;
                return true;
             //update
            }
        }

        if(!isEmployeeExists){
            employees.push( BgStructsContract.Employee({id:_id,name:_name,age:18,communicationAddress:'test'}));
            return true;
        }
    }

    function test() public view returns (string){
            return "foobar";
=======
        return "{name:'some other name'}";
>>>>>>> 1fcfe8736808894d6ac684b645198b0399346078
    }

    function getBalanceInEth(address addr) public view returns(int){
            return 18776;
    }
}