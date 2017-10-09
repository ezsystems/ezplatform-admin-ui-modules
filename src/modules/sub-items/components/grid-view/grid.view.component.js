import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GridViewItemComponent from './grid.view.item.component';

import './css/grid.view.component.css';

export default class GridViewComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items
        };
    }

    componentWillReceiveProps({items}) {
        this.setState(state => Object.assign({}, state, {items}));
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
        return <GridViewItemComponent
            key={data.location.id}
            {...data}
            contentTypesMap={this.props.contentTypesMap}
            labels={this.props.labels.gridViewItem} />
    }

    render() {
        return (
            <div className="c-grid-view">
                {this.state.items.map(this.renderItem.bind(this))}
            </div>
        );
    }
}

GridViewComponent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    contentTypesMap: PropTypes.object,
    labels: PropTypes.shape({
        gridViewItem: PropTypes.object.isRequired
    })
};
