import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        const baseClassName = 'c-grid-switcher__option';
        const attrs = {
            id,
            onClick: this.toggleListView.bind(this, id),
            className: baseClassName
        };

        if (this.state.activeView === id) {
            attrs.className = `${baseClassName} ${baseClassName}--active`;
        }

        if (this.props.isDisabled) {
            attrs.className = `${attrs.className} ${baseClassName}--disabled`
        }

        return (
            <div {...attrs}>
                <svg className="ez-icon">
                    <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${icon}`}></use>
                </svg>
            </div>
        );
    }

    render() {
        let componentClassName = 'c-grid-switcher';

        if (this.props.isDisabled) {
            componentClassName = `${componentClassName} ${componentClassName}--disabled`
        }

        const attrs = {
            className: componentClassName,
            title: this.props.tooltipLabel
        };

        return (
            <div {...attrs}>
                {this.renderButton('table', 'view-list')}
                {this.renderButton('grid', 'view-grid')}
            </div>
        );
    }
}

ViewSwitcherComponent.propTypes = {
    onViewChange: PropTypes.func.isRequired,
    activeView: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    tooltipLabel: PropTypes.string
};

ViewSwitcherComponent.defaultProps = {
    tooltipLabel: "Change view"
};