import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/finder.tree.leaf.component.css';

export default class FinderTreeLeafComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: props.selected
        };
    }

    componentWillReceiveProps({selected}) {
        this.setState(state => Object.assign({}, state, {selected}));
    }

    handleClick() {
        const {location} = this.props;

        this.setState(state => Object.assign({}, state, {selected: true}));

        this.props.onClick(location);
    }

    render() {
        const location = this.props.location;
        const componentClassName = 'c-finder-tree-leaf';
        const selectedClassName = this.state.selected ? `${componentClassName}--selected` : '';
        const childrenClassName = location.childCount ? `${componentClassName}--has-children` : '';
        const finalClassName = `${componentClassName} ${selectedClassName} ${childrenClassName}`;

        return (
            <div className={finalClassName} onClick={this.handleClick.bind(this)}>
                {location.ContentInfo.Content.Name}
            </div>
        );
    }
}

FinderTreeLeafComponent.propTypes = {
    location: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
};
