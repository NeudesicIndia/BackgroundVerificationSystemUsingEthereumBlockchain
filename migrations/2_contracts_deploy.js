var UniqueId = artifacts.require("./UniqueId.sol");
var EmployeeBGHistory = artifacts.require("./EmployeeBGHistory.sol");

module.exports = function(deployer) {
  deployer.deploy(UniqueId);
  deployer.link(UniqueId, EmployeeBGHistory);
  deployer.deploy(EmployeeBGHistory);
};


