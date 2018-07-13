import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/view.switcher.component.css';

export default class ViewSwitcherComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: props.activeView,
        };
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState(() => ({ activeView: props.activeView }));
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
     * @param {String} title label for title attribiute
     * @returns {Element}
     * @memberof ViewSwitcherComponent
     */
    renderButton(id, icon, title) {
        const baseClassName = 'c-grid-switcher__option';
        const attrs = {
            id,
            onClick: this.toggleListView.bind(this, id),
            className: baseClassName,
            title,
        };

        if (this.state.activeView === id) {
            attrs.className = `${baseClassName} ${baseClassName}--active`;
        }

        if (this.props.isDisabled) {
            attrs.className = `${attrs.className} ${baseClassName}--disabled`;
        }

        return (
            <div {...attrs}>
                <svg className="ez-icon">
                    <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${icon}`} />
                </svg>
            </div>
        );
    }

    render() {
        const listViewBtnLabel = Translator.trans(/*@Desc("View as list")*/ 'switch_to_list_view.btn.label', {}, 'sub_items');
        const gridViewBtnLabel = Translator.trans(/*@Desc("View as grid")*/ 'switch_to_grid_view.btn.label', {}, 'sub_items');
        let componentClassName = 'c-grid-switcher';

        if (this.props.isDisabled) {
            componentClassName = `${componentClassName} ${componentClassName}--disabled`;
        }

        return (
            <div className={componentClassName}>
                {this.renderButton('table', 'view-list', listViewBtnLabel)}
                {this.renderButton('grid', 'view-grid', gridViewBtnLabel)}
            </div>
        );
    }
}

ViewSwitcherComponent.propTypes = {
    onViewChange: PropTypes.func.isRequired,
    activeView: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
};
