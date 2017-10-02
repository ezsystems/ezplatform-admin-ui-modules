import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/finder.tree.leaf.component.css';

export default class FinderTreeLeafComponent extends Component {
    constructor() {
        super();

        this.state = {
            selected: false
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {selected: props.selected}));
    }

    handleClick() {
        const {locationData} = this.props;

        this.setState(state => Object.assign({}, state, {selected: true}));
        
        this.props.onClick(locationData);
    }

    render() {
        const location = this.props.locationData;
        const leafClassName = 'finder-tree-leaf-component.js';
        const selectedClassName = this.state.selected ? `${leafClassName}--selected` : '';
        const childrenClassName = location.childCount ? `${leafClassName}--has-children` : '';
        const finalClassName = `${leafClassName} ${selectedClassName} ${childrenClassName}`;

        return (
            <div className={finalClassName} onClick={this.handleClick.bind(this)}>
                {location.ContentInfo.Content.Name}
            </div>
        );
    }
}

FinderTreeLeafComponent.propTypes = {
    locationData: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
};
