import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeLeafComponent from './finder.tree.leaf.component.js';

import './css/finder.tree.branch.component.css';

export default class FinderTreeBranchComponent extends Component {
    constructor() {
        super();

        this.state = {
            selectedLocations: []
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {selectedLocations: props.selectedLocations}));
    }

    renderLeaf(data) {
        const location = data.value.Location;

        return <FinderTreeLeafComponent 
            key={location.remoteId} 
            locationData={location} 
            onClick={this.handleItemClick.bind(this)} 
            selected={this.state.selectedLocations.includes(location.id)} />
    }

    handleItemClick(location) {
        this.setState(state => Object.assign({}, state, {selectedLocation: location}));

        this.props.onItemClick({
            parent: location.id,
            location
        });
    }

    render() {
        return (
            <div className="finder-tree-branch-component">
                {this.props.items.map(this.renderLeaf.bind(this))}
            </div>
        );
    }
}

FinderTreeBranchComponent.propTypes = {
    items: PropTypes.array.isRequired,
    parent: PropTypes.number.isRequired,
    onItemClick: PropTypes.func.isRequired,
    selectedLocations: PropTypes.array
};
