import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './tab.nav.item.component.css';

export default class TabNavItemComponent extends Component {
    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {isSelected: !!props.isSelected}));
    }

    handleClick() {
        this.props.onClick(this.props.id);
    }

    render() {
        const attrs = {
            className: `tab-nav-item-component ${this.props.isSelected ? 'tab-nav-item-component--selected' : ''}`,
            onClick: this.handleClick.bind(this)
        };

        return (
            <div className="tab-nav-item-component__wrapper">
                <button {...attrs}>{this.props.title}</button>
            </div>
        );
    }
}

TabNavItemComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
