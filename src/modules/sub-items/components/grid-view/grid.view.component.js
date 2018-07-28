import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GridViewItemComponent from './grid.view.item.component';
import NoItemsComponent from '../no-items/no.items.component';

import './css/grid.view.component.css';

export default class GridViewComponent extends Component {
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);

        this.state = {
            items: props.items,
        };
    }

    UNSAFE_componentWillReceiveProps({ items }) {
        this.setState(() => ({ items }));
    }

    /**
     * Renders grid view list item
     *
     * @method renderItem
     * @param {Object} data
     * @returns {Element}
     * @memberof GridViewComponent
     */
    renderItem(data) {
        return (
            <GridViewItemComponent
                key={data.location.id}
                {...data}
                contentTypesMap={this.props.contentTypesMap}
                generateLink={this.props.generateLink}
            />
        );
    }

    /**
     * Renders no items message
     *
     * @method renderNoItems
     * @returns {Element}
     * @memberof GridViewComponent
     */
    renderNoItems() {
        return <NoItemsComponent />;
    }

    render() {
        const content = this.state.items.length ? this.state.items.map(this.renderItem) : this.renderNoItems();

        return <div className="c-grid-view">{content}</div>;
    }
}

GridViewComponent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    contentTypesMap: PropTypes.object,
    generateLink: PropTypes.func.isRequired,
};
