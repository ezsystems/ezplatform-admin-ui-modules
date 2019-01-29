import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './components/list/list.component';

export default class ContentTreeModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLocationId: props.selectedLocationId,
            locations: props.preloadedLocations,
        };
    }

    render() {
        return (
            <div className="m-content-tree">
                <List items={this.state.locations} />
            </div>
        );
    }
}

ContentTreeModule.propTypes = {
    selectedLocationId: PropTypes.number,
    preloadedLocations: PropTypes.arrayOf(PropTypes.object),
};

ContentTreeModule.defaultProps = {
    preloadedLocations: [],
};
