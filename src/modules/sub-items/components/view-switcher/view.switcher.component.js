import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconComponent from '../icon/icon.component';
import ICONS from '../icon/icons.constants.json';

import './css/view.switcher.component.css';

export default class ViewSwitcherComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: 'table'
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {activeView: props.activeView}));
    }

	toggleView(id) {
		this.props.onViewChange(id);
    }

    renderButton(id, icon) {
        const attrs = {
            id: 'table',
            onClick: this.toggleView.bind(this, id),
            className: 'c-grid-switcher__option'
        };

        if (this.state.activeView === id) {
            attrs.className = `${attrs.className} ${attrs.className}--active`;
        }

        return (
            <div {...attrs}>
                <IconComponent icon={icon} height={32} />
            </div>
        );
    }

    render() {
        return (
            <div className="c-grid-switcher">
                {this.renderButton('table', ICONS.VIEW_LIST)}
                {this.renderButton('grid', ICONS.VIEW_GRID)}
            </div>
        );
    }
}

ViewSwitcherComponent.propTypes = {
    onViewChange: PropTypes.func,
    activeView: PropTypes.string.isRequired
};

ViewSwitcherComponent.defaultProps = {
    activeView: 'table'
};