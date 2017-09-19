import React, { Component } from 'react';

class EventsPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            instance: props.instance,
            events: props.events,
            declarations: [],
            selected: ''
        };
    }

    componentWillMount() {
        let events = this.state.instance.allEvents((error, log) => {
            console.log(error);
            console.log(log);
        });

        events.get((error, logs) => {
            console.log(logs);
        });

        this.eventHeader();

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


    eventHeader = () => {
        const declarations = this.state.events.map(f => 
            <option value={ f.name } key={ f.name }> { f.name }({ this.formatHeader(f.inputs) }) </option>
        );

        console.log(declarations);

        this.setState({
            declarations
        });
    }

      selectMethod = (event) => {

        const name = event.target.value;

        this.setState({
            selected: name
        });
      }

    render() {
        return (
            <div className="row">
                <div className="col-lg-8"> 
                  <div className="well bs-component">
                     <form className="form-horizontal">
                      <legend>Events</legend>
                        <div className="form-group">
                            <div className="col-lg-10">
                                <select className="form-control" onChange={ this.selectMethod } value={ this.state.selected } id="select">
                                    { this.state.declarations }
                                </select>
                            </div>
                        </div>
                     </form>
                  </div>
                </div>
              </div>
        )
    }
}

export default EventsPanel;