import React, { Component } from 'react';

class EventsPanel extends Component {

    constructor(instance, events) {
        super();

        this.state = {
            instance,
            events
        };
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-8"> 
                  <div className="well bs-component">
                     <form className="form-horizontal">
                      <legend>Events</legend>

                     </form>
                  </div>
                </div>
              </div>
        )
    }
}

export default EventsPanel;