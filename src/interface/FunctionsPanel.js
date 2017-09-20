import React, { Component } from 'react';

import ResultItem from "./ResultItem";

class FunctionsPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            instance: props.instance,
            functions: props.functions,
            accounts: props.accounts,
            fallback: props.fallback,
            web3: props.web3,
            declarations: [],
            selected: '',
            hasInputs: false,
            inputs: '',
            logs: [],
            loading: false,
            ether: '',
            currName: ''
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
            declarations,
            selected: declarations[0].name
        });
    }

    runFunction = async () => {
        const name = this.state.selected;

        const account = this.state.accounts[0];

        if(name === "fallback-method") {
            await this.makeTransaction(account, {}, [], true);
            return;
        }

        let ourMethod = this.state.functions.find(f => f.name === name);

        const isTransaction = !ourMethod.constant;

        // no inputs to get from the user just run it
        if(ourMethod.inputs.length === 0) {
            if(isTransaction) {
                await this.makeTransaction(account, ourMethod, []);
            } else {
                await this.makeCall(ourMethod.name, []);
            }
        } else {

            let inputsArr = [];

            ourMethod.inputs.forEach(input => {

                let value = this.state[input.name];

                if(input.type.indexOf("uint") !== -1) {
                    value = parseInt(value, 10);
                }
                inputsArr.push(value);

                this.setState({
                    [input]: ""
                });
            });

            console.log(this.state);

            if(!isTransaction) {
                await this.makeCall(ourMethod.name, inputsArr);
            } else {
                await this.makeTransaction(account, ourMethod, inputsArr);
            }
            
        }
    }

    makeTransaction = async (account, ourMethod, inputsArr, fallback) => {

        const valueInEther = this.state.web3.toWei(this.state.ether || 0, 'ether');

        let method = this.state.instance[ourMethod.name];
        
        if(fallback) {
            method = this.state.instance;
        }

        method.sendTransaction(...inputsArr, {
            from: account, value: valueInEther
        }).then(tx => {

            //Just wtf!
            if(tx.tx) {
                tx = tx.tx;
            }

            this.setState({loading: true, ether: ''});

            const currLogs = this.state.logs;

            const name = ourMethod.name || "";

            this.setState({
                currName: name
            });

            let interval = setInterval(() => {

                this.state.web3.eth.getTransactionReceipt(tx, (err, details) => {


                    if(details) {
                        currLogs.push({isCall: false, transactionHash: tx, gas: details.gasUsed});

                        this.setState({
                            name: this.state.currName,
                            index: currLogs.length,
                            logs: currLogs,
                            loading: false
                        });

                        clearInterval(interval);
                    }

                });
            }, 3000);
        }).catch(err => {
            console.log("Error", err);
        })
    }

    makeCall = async (name, inputsArr) => {

        try {
            const result = await this.state.instance[name].call(...inputsArr);

            const currLogs = this.state.logs;

            currLogs.push({
                name: name,
                index: currLogs.length,
                isCall: true,
                result: result.valueOf()
            });

            this.setState({logs: currLogs});
        } catch(err) {
            console.log(err);
        }
    

    }

    selectMethod = (event) => {

        const name = event.target.value;

        if(name === "fallback-method") {
            this.setState({
                selected: "fallback-method",
                payable: true
            });

            return;
        }

        let state = false;

        let ourMethod = this.state.functions.find(f => f.name === name);
        let inputs;
        let payable = false;

        if(ourMethod.payable) {
            payable = true;
        }

        if(ourMethod.inputs.length > 0) {
            state = true;

            inputs = ourMethod.inputs.forEach((input, i) => {

                if(input.name === "") {
                    input.name = "name" + i;
                }

            });

            inputs = ourMethod.inputs.map((input, i) => {

                if(input.name === "") {
                    input.name = "name" + i;
                }

                if(i % 2 !== 0) {
                    return (
                        <div className="row" key={ input.name }>
                            <div className="col-lg-4">
                                <input name={ input.name } value={ this.state[input.name] } onChange={ this.getInputs } type="text" className="form-control" placeholder={ input.name } />
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="col-lg-4" key={ input.name }>
                            <input name={ input.name } value={ this.state[input.name] } onChange={ this.getInputs } type="text" className="form-control" placeholder={ input.name } />
                        </div>
                    );
                }
                
            });
        }

        this.setState({
            selected : name,
            hasInputs: state,
            inputs: inputs,
            payable: payable
        });
    }

    getInputs = (event) => {

        console.log(event.target.name, event.target.value);

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
                                    <option value=""> Select a method to test </option>
                                    <option value="fallback-method"> Fallback function { this.state.fallback ? " (payable)" : " (non payable)"}</option>
                                    { this.state.declarations }
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <button type="button" className="btn btn-info" onClick={ this.runFunction }>Run!</button>
                            </div>
                        </div>

                        { this.state.payable &&
                            <div className="form-group">
                                <div className="col-lg-8">
                                    <input name="ether" value={ this.state.ether } onChange={ this.getInputs } type="text" className="form-control" placeholder="Send ether in transaction" />
                                </div>
                            </div>
                        }

                        <div className="form-group">
                            { this.state.hasInputs && 
                                this.state.inputs
                            }
                        </div>

                        <div>
                            { 
                                this.state.logs.map(log => 
                                    <ResultItem data={ log } />
                                ) 
                            
                            }
                        </div>
                        <div>
                            {
                                this.state.loading && 
                                <div className="alert alert-dismissible alert-warning">
                                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                                    <span>Waiting for transaction to be mined!</span>
                                </div>
                            }
                        </div>
                     </form>
                  </div>
                </div>
        )
    }
}

export default FunctionsPanel;