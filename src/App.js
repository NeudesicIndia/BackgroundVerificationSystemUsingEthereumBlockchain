import React, { Component } from 'react'
import EmployeeBGHistoryContract from '../build/contracts/EmployeeBGHistory.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'



class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      employeeCount: 0,
      searchEmpId:'',
      web3: null,
     empId:null,
      name:null,
      age:null,
      address:"",
      employementHistory:[{employerName:"Neudesic", from:"12/1/2018", to:"11/11/111"},
      {employerName:"qweqwe", from:"12/1/2018", to:"11/11/111"}]
     
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
    this.employeeBGHistoryInstance= null;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      employeeBGHistory.deployed().then((instance) => {
        this.employeeBGHistoryInstance = instance

        // Stores a given value, 5 by default.
        //return employeeBGHistoryInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return this.employeeBGHistoryInstance.getEmployeeCount.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
       return this.setState({ employeeCount: result.c[0] })
      })
    })
  }

  searchEmployee (empId){
    this.employeeBGHistoryInstance.getEmployee(empId).then((employeeResponse)=>{
      console.log('employee search response')
      console.log(employeeResponse);
      this.setState({ name: employeeResponse[0] });
      this.setState({ address: employeeResponse[2] });
      this.setState({ age: employeeResponse[1] });
    })
  }

  handleChange=(onElement,event)=>{
    if(onElement === "empid")
    this.setState({empId: event.target.value})
    else if(onElement === "name")
    this.setState({empId: event.target.value})
    else if(onElement === "age")
    this.setState({age: event.target.value})
    else if(onElement === "searchEmpId")
    {
      this.setState({searchEmpId: event.target.value});
      this.searchEmployee(event.target.value);
    }
    
  }

  
  addUserDetails = ()=>{

  }
  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.employeeCount}</p>
              <form >
                  Search Employee : <input type="text" value={this.state.empId} onChange={this.handleChange.bind(this, "searchEmpId")} />
                  <br/>
                  <br/>
                  <div>
                  emp id: <input type="text" value={this.state.empId} onChange={this.handleChange.bind(this, "empid")} />
                  Name: <input type="text"  value={this.state.name} onChange={this.handleChange.bind(this, "name")} />
                  Age: <input type="number"  value={this.state.age} onChange={this.handleChange.bind(this, "age")} />
                  </div>
                  <br/>
                  Address: <textarea   value={this.state.address} />
                  <br/>
                  <br/>
                  {this.state.employementHistory.map((emp,i) => {return <div>


employee name : <input type  = "text" value={emp.employerName}/>
from : <input type  = "text" value={emp.from}/>
to:  <input type  = "text" value={emp.to}/>
<br/>
<br/>
                  </div> } )}
                  <button type="Submit" onClick={this.addUserDetails()} >Submit</button>
                  <button>Cancel</button>
              </form>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
