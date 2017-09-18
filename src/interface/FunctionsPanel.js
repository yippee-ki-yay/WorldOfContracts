import React, { Component } from 'react';

class FunctionsPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            instance: props.instance,
            functions: props.functions,
            declarations: [],
            selected: '',
            hasInputs: false
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

    runFunction = () => {
        const name = this.state.selected;

        let ourMethod = this.state.functions.find(f => f.name === name);

        console.log(ourMethod);

        const isTransaction = !ourMethod.constant;

        // no inputs to get from the user just run it
        if(ourMethod.inputs.length === 0) {
            if(isTransaction) {
                this.state.instance[ourMethod.name].sendTransaction({from: '', value: 0});
            } else {

            }
        } else {
            this.setState({
                hasInputs: true
            });
        }
    }

    handleChange = (event) => {

        const name = event.target.value;
        let state = false;

        let ourMethod = this.state.functions.find(f => f.name === name);

        if(ourMethod.inputs.length > 0) {
            state = true;
        }

        this.setState({
            selected : name,
            hasInputs: state
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
                                <select className="form-control" onChange={ this.handleChange } value={ this.state.selected } id="select">
                                    { this.state.declarations }
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <button type="button" className="btn btn-info" onClick={ this.runFunction }>Run!</button>
                            </div>
                        </div>

                        { this.state.hasInputs && 
                            <div className="row">
                                <div className="col-lg-8">
                                    <input name="inputs" value={ this.state.inputs } onChange={ this.handleChange } type="text" className="form-control" placeholder="Add inputs seperated by ," />
                                </div>
                            </div>
                        }
                     </form>
                  </div>
                </div>
        )
    }
}

export default FunctionsPanel;