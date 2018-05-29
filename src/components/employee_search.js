import React, {
    Component
} from 'react'

import { Button, Form, FormGroup, Label, Input, FormText, Col } from 'reactstrap';
import EmployeeBGHistoryContract from '../../build/contracts/EmployeeBGHistory.json'
import getWeb3 from '../utils/getWeb3'

// import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';

import EditHistoryButton from './edit_history_button'
import AddEmployeeModal from './add_employee_modal'



class EmployeeSearch extends Component {
    constructor(props) {
        super(props)



        this.state = {
            isNewEmployee: false,
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
        this.accounts = null;
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            employeeBGHistory.deployed().then((instance) => {
                this.employeeBGHistoryInstance = instance
                this.accounts = accounts;

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
        if (onElement === "empId")
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

    searchEmployee() {
        this.employeeBGHistoryInstance.getEmployee(this.state.searchEmpId, {
            from: this.accounts[0],
            gas: 4712389
        }).then((employeeResponse) => {
            console.log('employee search response')
            console.log(employeeResponse);

            this.setState({
                empId: this.state.searchEmpId
            });


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

                    response.push({ employerName: result[i][0], from: result[i][1], to: result[i][2] });

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
                from: this.accounts[0],
                gas: 4712389
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

    // handleChange = (onElement, event) => {
    //     if (onElement === "searchEmpId")
    //         this.setState({
    //             searchEmpId: event.target.value
    //         })

    // }

    addEmployeeDetails() {
        this.setState({
            isNewEmployee: true
        })


    }

    saveEmployeeDetails() {
        this.employeeBGHistoryInstance.setEmployee(this.state.empId, this.state.name, this.state.age, this.state.address, {
            from: this.accounts[0],
            gas: 4712389
        }).then((addEmployeeResponse) => {
            console.log('employee add response');
            console.log(addEmployeeResponse);

            this.setState({
                isNewEmployee: false
            })

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

    handleInsertButtonClick = (onClick) => {
        // Custom your onClick event here,
        // it's not necessary to implement this function if you have no any process before onClick
        console.log('This is my custom function for InserButton click event');
        onClick();
    }
    createCustomInsertButton = (onClick) => {
        return (
            <InsertButton
                btnText='Add Employment History'
                btnContextual='btn-info'
                className='my-custom-class'
                btnGlyphicon='glyphicon-edit'
                onClick={() => this.handleInsertButtonClick(onClick)} />
        );
    }

    onAddRow(row) {
        this.state.employementHistory.push({ employerName: row.employerName, from: row.from, to: row.to })
        this.setState({
            employementHistory: this.state.employementHistory
        });
    }

    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <EditHistoryButton cell={cell} row={row} rowIndex={rowIndex} />
        )
    }

    render() {
        var partial = '';
        if (this.state.isNewEmployee) {
            partial = <FormGroup>
                <Button onClick={() => this.saveEmployeeDetails()}>Save Employee Details</Button>
                <Button >Cancel</Button>
            </FormGroup>
        }


        return (
            <div>
                <h4>Verify Employee Details </h4>
                <Button className="btn btn-info float-right" onClick={() => this.addEmployeeDetails()}>Add Employee Details</Button>
                <Form>
                    <FormGroup>
                        <Label for="searchEmpId">PAN Number</Label>
                        <Input type="text" name="searchEmpId" id="searchEmpId" placeholder="PAN Number" value={
                            this.state.searchEmpId
                        }
                            onChange={
                                this.handleChange.bind(this, "searchEmpId")
                            } />
                        <Button onClick={() => this.searchEmployee()}>Submit</Button>
                        <Button >Cancel</Button>


                    </FormGroup>


                    <div>
                        <h4> Employe Details </h4>

                        <div className="clearfix " style={{ padding: '.5rem' }}>

                            <Form>
                                <FormGroup row>
                                    <Label for="empId" sm={2}>PAN Number</Label>
                                    <Col sm={5}>
                                        <Input disabled={!this.state.isNewEmployee} type="text" name="empId" id="empId"
                                            placeholder="PAN Number" value={
                                                this.state.empId
                                            } onChange={
                                                this.handleChange.bind(this, "empId")
                                            } />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="name" sm={2}>Name</Label>
                                    <Col sm={5}>
                                        <Input disabled={!this.state.isNewEmployee} type="text" name="name" id="name" placeholder="Name" value={
                                            this.state.name
                                        } onChange={
                                            this.handleChange.bind(this, "name")
                                        } />
                                    </Col>
                                </FormGroup>


                                <FormGroup row>
                                    <Label for="age" sm={2}>Age</Label>
                                    <Col sm={5}>
                                        <Input disabled={!this.state.isNewEmployee} type="text" name="age" id="age" placeholder="Age" value={
                                            this.state.age
                                        } onChange={
                                            this.handleChange.bind(this, "age")
                                        } />
                                    </Col>
                                </FormGroup>


                                <FormGroup row>
                                    <Label for="address" sm={2}>Address</Label>
                                    <Col sm={5}>
                                        <Input disabled={!this.state.isNewEmployee} type="textarea" name="address" id="address" placeholder="Address"
                                         value={
                                            this.state.address
                                        } onChange={
                                            this.handleChange.bind(this, "address")
                                        } />
                                    </Col>
                                </FormGroup>

                                {partial}
                            </Form>


                        </div>

                    </div>


                    <div>
                        <h4> Employment History </h4>
                        <Button className="btn btn-info float-right" onClick={() => this.addEmpHistory()}>Save Employment History</Button>


                        <BootstrapTable data={this.state.employementHistory} options={{
                            noDataText: 'No Data Available',
                            insertBtn: this.createCustomInsertButton,
                            onAddRow: this.onAddRow.bind(this)
                        }}
                            insertRow>
                            <TableHeaderColumn dataField='employerName' isKey>Employer Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='from'>Joining Date</TableHeaderColumn>
                            <TableHeaderColumn dataField='to'>Exit Date</TableHeaderColumn>
                            {/* <TableHeaderColumn
                            dataField='from'
                            dataFormat={this.cellButton.bind(this)}>Joining Date</TableHeaderColumn>

                             <TableHeaderColumn
                            dataField='to'
                            dataFormat={this.cellButton.bind(this)}>Exit Date</TableHeaderColumn> */}
                        </BootstrapTable>
                    </div>


                </Form>
            </div>

        );
    }
}


export default EmployeeSearch