pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

contract EmployeeBGHistory {
     struct Employee {
        string name;
        uint age;
        string communicationAddress;
        //OrganizationHistory[] organizationHistory;
    }

    constructor() public {
    }

    mapping(string => Employee) employees;
    string[] public employeeKeys;

    function setEmployee(string empId, string name, uint age, string cAddress) public {
        var employee = employees[empId];
        employee.name = name;
        employee.age = age;
        employee.communicationAddress = cAddress;

        employeeKeys.push(empId) - 1;
    }
    function getEmployeeKeys() view public returns (string[]) {
        return employeeKeys;
    }
    function getEmployee(string empId) view public returns (string, uint, string) {
        return (employees[empId].name, employees[empId].age, employees[empId].communicationAddress);
    }
    function getEmployeeCount() view public returns (uint) {
        return employeeKeys.length;
    }

}