import React, {
    Component
} from 'react'

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


// import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';

class EditHistoryButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(cell, row, rowIndex) {
        console.log('from edit ',row)
        // this.dialog.show({
        //     body: `Confirm... "${cell}"?`,
        //     actions: [
        //         Dialog.CancelAction(),
        //         Dialog.OKAction(() => {
        //         // do whatever you want
        //         })
        //     ]
        // })
   }

   render() {
        const { cell, row, rowIndex } = this.props;
        return (
            <div>
                <Button
                    bsStyle="primary"
                    onClick={() => this.handleClick(cell, row, rowIndex)}
                >{cell} Edit</Button>
                {/* <Dialog ref={(el) => { this.dialog = el }} /> */}
            </div>
            // <React.Fragment>
            //     <Button
            //         bsStyle="primary"
            //         onClick={() => this.handleClick(cell, row, rowIndex)}
            //     >Show Info</Button>
            //     {/* <Dialog ref={(el) => { this.dialog = el }} /> */}
            // </React.Fragment>
        )
    }
}

export default EditHistoryButton