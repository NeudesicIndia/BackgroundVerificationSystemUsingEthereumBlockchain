pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

contract EmployeeBGHistory {
    struct Employee {
        string name;
        uint age;
        string communicationAddress;
        EmployeeHistory[] history;
    }

    struct EmployeeHistory{
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
    function getEmployee(string empId) view public returns (string, uint, string) {
        return (employees[empId].name, employees[empId].age, employees[empId].communicationAddress);
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

        var history = EmployeeHistory(orgName, joiningDate, exitDate);
        employee.history.push(history) - 1;
    }

}