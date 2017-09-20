import React, { Component } from 'react';

import './interface.css';

class EventsPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            instance: props.instance,
            events: props.events,
            declarations: [],
            selected: '',
            logs: []
        };
    }

    componentWillMount() {
        this.state.instance.allEvents((error, msg) => {
            if(error) {
                console.log(error);
            }
            
            const log = {
                name: msg.event,
                tx: msg.transactionHash,
                values: []
            };

            let event  = this.state.events.find(e => e.name === log.name);

            event.inputs.forEach(e => {
                let argument = msg.args[e.name];

                log.values.push(argument.valueOf());
            });

            let currLogs = this.state.logs;
            currLogs.push(log);

            this.setState({
                logs: currLogs
            })
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
                        
                            {
                                this.state.logs.map(log => 
                                    <div className="row">
                                    <div className="col-lg-8"> 
                                        <div key={ log.tx } className="well well-sm">
                                            <div>Event: { log.name }  </div>
                                            <div>Results:
                                                {
                                                    log.values.map(v => 
                                                        <span className="text-success results"> { v } </span>
                                                    )
                                                }
                                             </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                     </form>
                  </div>
                </div>
              </div>
        )
    }
}

export default EventsPanel;