import React, { Component } from 'react';

class FunctionsPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            instance: props.instance,
            functions: props.functions,
            accounts: props.accounts,
            web3: props.web3,
            declarations: [],
            selected: '',
            hasInputs: false,
            inputs: ''
        };
    }

    componentWillMount() {
        this.functionHeader();
    }

    formatHeader = (inputs, output) => {
        let inputStr = [];

        if(inputs.length === 0) {
            return "";
        }

        inputs.forEach((row) => {
            inputStr.push(row.type + " " + row.name);
        });

        if(!output) {
            return inputStr.join(", ");
        } else {
            return " returns(" + inputStr.join(", ") + ");";
        }

    }

    functionHeader = () => {
        const declarations = this.state.functions.map(f => 
            <option value={ f.name } key={ f.name }> { f.name }({ this.formatHeader(f.inputs) }) { this.formatHeader(f.outputs, true) }</option>
        );

        this.setState({
            declarations
        });
    }

    runFunction = async () => {
        const name = this.state.selected;

        let ourMethod = this.state.functions.find(f => f.name === name);

        const account = this.state.accounts[0];

        const isTransaction = !ourMethod.constant;

        // no inputs to get from the user just run it
        if(ourMethod.inputs.length === 0) {
            if(isTransaction) {
                this.state.instance[ourMethod.name].sendTransaction({from: account, value: 0});
            } else {

            }
        } else {

            let inputsArr = [];

            ourMethod.inputs.forEach(input => {
                inputsArr.push(this.state[input.name]);
            });

            const tx = await this.state.instance[ourMethod.name].sendTransaction(...inputsArr, {
                from: account, value: 0
            });

            setInterval(() => {
                this.state.web3.eth.getTransactionReceipt(tx, (err, details) => {
                console.log(details);
            });
            }, 8000)

            
        }
    }

    selectMethod = (event) => {

        const name = event.target.value;
        let state = false;

        let ourMethod = this.state.functions.find(f => f.name === name);
        let inputs;

        if(ourMethod.inputs.length > 0) {
            state = true;

            inputs = ourMethod.inputs.map((input, i) => {

                if(i % 2 !== 0) {
                    return (
                        <div className="row">
                            <div className="col-lg-4">
                                <input name={ input.name } value={ this.state[input.name] } onChange={ this.getInputs } type="text" className="form-control" placeholder="Add input" />
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="col-lg-4">
                            <input name={ input.name } value={ this.state[input.name] } onChange={ this.getInputs } type="text" className="form-control" placeholder="Add input" />
                        </div>
                    );
                }
                
            });
        }

        this.setState({
            selected : name,
            hasInputs: state,
            inputs: inputs
        });
    }

    getInputs = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    render() {
        return (
                <div className="col-lg-8"> 
                  <div className="well bs-component">
                     <form className="form-horizontal">
                      <legend>Functions</legend>
                         <div className="form-group">
                            <div className="col-lg-10">
                                <select className="form-control" onChange={ this.selectMethod } value={ this.state.selected } id="select">
                                    { this.state.declarations }
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <button type="button" className="btn btn-info" onClick={ this.runFunction }>Run!</button>
                            </div>
                        </div>

                        <div className="form-group">
                            { this.state.hasInputs && 
                                this.state.inputs
                            }
                        </div>
                     </form>
                  </div>
                </div>
        )
    }
}

export default FunctionsPanel;