import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconComponent from '../../../common/icon/icon.component';
import { VIEW_LIST } from '../../../common/icon/defs/view-list.json';
import { VIEW_GRID } from '../../../common/icon/defs/view-grid.json';

import './css/view.switcher.component.css';

export default class ViewSwitcherComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: props.activeView
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {activeView: props.activeView}));
    }

    /**
     * Toggles list view
     *
     * @method toggleListView
     * @param {String} id
     * @memberof ViewSwitcherComponent
     */
	toggleListView(id) {
		this.props.onViewChange(id);
    }

    /**
     * Renders a list button
     *
     * @param {String} id
     * @param {String} icon icon identifier
     * @returns {Element}
     * @memberof ViewSwitcherComponent
     */
    renderButton(id, icon) {
        const attrs = {
            id,
            onClick: this.toggleListView.bind(this, id),
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
                {this.renderButton('table', VIEW_LIST)}
                {this.renderButton('grid', VIEW_GRID)}
            </div>
        );
    }
}

ViewSwitcherComponent.propTypes = {
    onViewChange: PropTypes.func.isRequired,
    activeView: PropTypes.string.isRequired
};
