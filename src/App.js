import React, {
  Component
} from 'react'
//import Button from 'react-bootstrap/lib/Button';
import EmployeeBGHistoryContract from '../build/contracts/EmployeeBGHistory.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'



class App extends Component {
  constructor(props) {
    super(props)
    this.addEmpHistory = this.addEmpHistory.bind(this);

    this.state = {
      employeeCount: 0,
      searchEmpId: '',
      web3: null,
      empId: null,
      name: null,
      age: null,
      address: "",
      employementHistory: [
        //{employerName:"Neudesic", from:"12/1/2018", to:"11/11/2020"}
        //{employerName:"qweqwe", from:"12/1/2018", to:"11/11/111"}
      ]

    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const employeeBGHistory = contract(EmployeeBGHistoryContract)
    employeeBGHistory.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    this.employeeBGHistoryInstance = null;
    this.accounts  = null;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      employeeBGHistory.deployed().then((instance) => {
        this.employeeBGHistoryInstance = instance
        this.accounts  =  accounts;

        // Stores a given value, 5 by default.
        //return employeeBGHistoryInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return this.employeeBGHistoryInstance.getEmployeeCount.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({
          employeeCount: result.c[0]
        })
      })
    })
  }



  handleChange = (onElement, event) => {
    if (onElement === "empid")
      this.setState({
        empId: event.target.value
      })
    else if (onElement === "name")
      this.setState({
        name: event.target.value
      })
    else if (onElement === "age")
      this.setState({
        age: event.target.value
      })
    else if (onElement === "address")
      this.setState({
        address: event.target.value
      })
    else if (onElement === "searchEmpId") {
      this.setState({
        searchEmpId: event.target.value
      });
      //this.searchEmployee(event.target.value);
    }

  }

  // 
  searchEmployee() {
    this.employeeBGHistoryInstance.getEmployee(this.state.searchEmpId, { 
      from:  this.accounts[0],
       gas:  4712389 
    }).then((employeeResponse) => {
      console.log('employee search response')
      console.log(employeeResponse);

      this.setState({
        name: employeeResponse[0]
      });
      this.setState({
        address: employeeResponse[2]
      });
      this.setState({
        age: employeeResponse[1]
      });

      var promises = [];
      //get history records
      for (var i = 0; i < employeeResponse[3].length; i++) {

        promises.push(this.employeeBGHistoryInstance.getHistory(this.state.searchEmpId, employeeResponse[3][i]));

      }

      Promise.all(promises).then((result) => {
        var response = [];
        for (var i = 0; i < result.length; i++) {

          response.push({employerName:result[i][0],from:result[i][1],to:result[i][2]});
  
        }
        this.setState({
          employementHistory: response
        });
      });


    }, (error) => {
      console.log(error);
      this.setState({
        empId: ''
      });
      this.setState({
        name: ''
      });
      this.setState({
        address: ''
      });
      this.setState({
        age: ''
      });
    })
  }

  addEmpHistory() {
    var employmentHistory = this.state.employementHistory[this.state.employementHistory.length - 1];
    this.employeeBGHistoryInstance.addHistory(this.state.empId, employmentHistory.employerName, employmentHistory.from,
      employmentHistory.to, { 
        from:  this.accounts[0],
         gas:  4712389 
      }).then((employeeResponse) => {
      console.log('employee History add response');
      console.log(employeeResponse);

    })

    // this.employeeBGHistoryInstance.addHistory('12','neu','qw',
    //   'employmentHistory.to').then((employeeResponse)=>{
    //  console.log('employee add response');
    //  console.log(employeeResponse);
    //})
  }
  addEmp() {
    this.employeeBGHistoryInstance.setEmployee(this.state.empId, this.state.name, this.state.age, this.state.address, { 
      from:  this.accounts[0],
       gas:  4712389 
    }).then((addEmployeeResponse) => {
      console.log('employee add response');
      console.log(addEmployeeResponse);
      this.setState({
        empId: ''
      });
      this.setState({
        name: ''
      });
      this.setState({
        address: ''
      });
      this.setState({
        age: ''
      });
      this.setState({
        searchEmpId: ''
      });
      this.employeeBGHistoryInstance.getEmployeeCount().then((result) => {
        // Update state with the result.
        return this.setState({
          employeeCount: result.c[0]
        });
      });

    });
  }

  render() {
      return ( <
          div className = "App" >
          <
          nav className = "navbar pure-menu pure-menu-horizontal" >
          <
          a href = "#"
          className = "pure-menu-heading pure-menu-link" > Truffle Box < /a> <
          /nav>

          <
          main className = "container" >
          <
          div className = "pure-g" >
          <
          div className = "pure-u-1-1" >
          <
          h1 > Employee Background Verification! < /h1> <
          p > Technology used: Ganache, Truffle, Web3js, Reactjs < /p> <
          h2 > Smart Contract Example to do Following: < /h2> <
            p > Search Employee and Add Employee. < /p> <
            p > Employment Background < /p> <
            p > Educational Background < /p> <
            p > Criminal Background < /p>

            <
            p > Total number of Employees in the Ledger: < strong > {
              this.state.employeeCount
            } < /strong></p >
            <
            form >
            Search Employee: < input type = "text"
          value = {
            this.state.searchEmpId
          }
          onChange = {
            this.handleChange.bind(this, "searchEmpId")
          }
          />

          {
            " "
          } <
          input type = "button"
          onClick = {
            this.searchEmployee.bind(this)
          }
          value = "Search" / >
          <
          br / >
          <
          br / >
          <
          div >
          emp id: < input type = "text"
          value = {
            this.state.empId
          }
          onChange = {
            this.handleChange.bind(this, "empid")
          }
          />{" "}
          Name: < input type = "text"
          value = {
            this.state.name
          }
          onChange = {
            this.handleChange.bind(this, "name")
          }
          />{" "}
          Age: < input type = "number"
          value = {
            this.state.age
          }
          onChange = {
            this.handleChange.bind(this, "age")
          }
          /> <
          /div> <
          br / >
          Address: < textarea value = {
            this.state.address
          }
          onChange = {
            this.handleChange.bind(this, "address")
          }
          /> <
          br / >
          <
          br / > {
            this.state.employementHistory.map((emp, i) => {
                return <div >


                  Employer name: < input type = "text"
                value = {
                  emp.employerName
                }
                onChange = {
                  this.handleChange.bind(this, "emp.employerName")
                }
                />{" "}
                From: < input type = "text"
                value = {
                  emp.from
                }
                onChange = {
                  this.handleChange.bind(this, "emp.from")
                }
                />{" "}
                To: < input type = "text"
                value = {
                  emp.to
                }
                onChange = {
                  this.handleChange.bind(this, "emp.to")
                }
                />{" "} <
                br / >
                  <
                  br / >
                  <
                  /div> } )} <
                  input type = "button"
                onClick = {
                  this.addEmp.bind(this)
                }
                value = "AddEmployee" / > {
                    " "
                  } <
                  input type = "button"
                onClick = {
                  this.addEmpHistory
                }
                value = "Employment Background" / > {
                    " "
                  } <
                  input type = "button"
                value = "Educational Background" / > {
                    " "
                  } {
                    " "
                  } <
                  input type = "button"
                onClick = {
                  this.addEmpHistory
                }
                value = "Criminal Background" / > {
                    " "
                  } <
                  button > Cancel < /button> <
                  /form>

                  <
                  /div> <
                  /div> <
                  /main> <
                  /div>
              );
            }
          }

          export default App