pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "./UniqueId.sol";

contract EmployeeBGHistory {
    struct Employee {
        string name;
        uint age;
        string communicationAddress;
        EmployeeHistory[] history;
        uint[] historyIds;
    }

    struct EmployeeHistory{
        uint historyId;
        string orgName;
        string joiningDate;
        string exitDate;
    }

    constructor() public {
    }

    mapping(string => Employee) employees;
    string[] public employeeKeys;
    
    event logError(string error);

    //empId will be the PAN number
    function setEmployee(string empId, string name, uint age, string cAddress) public {
      
        require(bytes(empId).length != 0, "Employee Identifier can not be blank");
        require(bytes(name).length != 0, "Employee Name can not be blank");
        require(age > 10, "Employee Age can not be less than 10 years");
        require(bytes(cAddress).length != 0, "Employee Address can not be blank");
        require(bytes(employees[empId].name).length == 0, "Employee already exists on the chain. Use addHistory to create a new history.");

        var employee = employees[empId];
        employee.name = name;
        employee.age = age;
        employee.communicationAddress = cAddress;

        employeeKeys.push(empId) - 1;
    }
    function getEmployeeKeys() view public returns (string[]) {
        return employeeKeys;
    }
    function getEmployee(string empId) view public returns (string, uint, string, uint[]) {
        require(bytes(employees[empId].name).length != 0, "Employee does not exist on the chain. Use setEmployee to create a new employee.");
        
        return (employees[empId].name, employees[empId].age, employees[empId].communicationAddress, employees[empId].historyIds);
    }
    function getEmployeeCount() view public returns (uint) {
        return employeeKeys.length;
    }
    function addHistory(string empId, string orgName, string joiningDate, string exitDate) public {
        require(bytes(empId).length != 0, "Employee Identifier can not be blank");
        require(bytes(employees[empId].name).length != 0, "Employee does not exist on the chain. Use setEmployee to create a new employee.");
        require(bytes(orgName).length != 0, "Employee Organization can not be blank");
        require(bytes(joiningDate).length != 0 || bytes(exitDate).length != 0, "One of joiningDate or exitDate needs to be supplied.");

        var employee = employees[empId];
        var historyId = UniqueId.getUniqueId();
        var history = EmployeeHistory(historyId, orgName, joiningDate, exitDate);
        employee.historyIds.push(historyId) - 1;
        employee.history.push(history) - 1;
    }
    function getHistory(string empId, uint historyId) view public returns(string, string, string) {
        var employee = employees[empId];
        require(bytes(employee.name).length != 0, "Employee does not exist on the chain. Use setEmployee to create a new employee.");
        for(uint i = 0; i < employee.history.length; i++){
            var history = employee.history[i];
            if(history.historyId == historyId)
                return (history.orgName, history.joiningDate, history.exitDate);
        }
        return ("", "", "");
    }
}

