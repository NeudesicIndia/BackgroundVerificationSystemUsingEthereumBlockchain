var EmployeeBGHistory = artifacts.require("./EmployeeBGHistory.sol");
//var Emp = artifacts.require("./Emp.sol");

module.exports = function(deployer) {
  deployer.deploy(EmployeeBGHistory);
  //deployer.deploy(Emp);
};
