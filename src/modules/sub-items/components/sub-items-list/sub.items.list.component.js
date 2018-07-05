import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableViewComponent from '../table-view/table.view.component.js';
import GridViewComponent from '../grid-view/grid.view.component.js';

import './css/sub.items.list.component.css';

export default class SubItemsListComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: props.activeView,
            views: {
                table: TableViewComponent,
                grid: GridViewComponent,
            },
        };
    }

    componentWillReceiveProps(props) {
        this.setState((state) => Object.assign({}, state, { activeView: props.activeView }));
    }

    render() {
        const Component = this.state.views[this.state.activeView];

        return <Component {...this.props} />;
    }
}

SubItemsListComponent.propTypes = {
    activeView: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    contentTypesMap: PropTypes.object.isRequired,
    handleItemPriorityUpdate: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        tableView: PropTypes.object.isRequired,
        tableViewItem: PropTypes.object.isRequired,
    }).isRequired,
    languages: PropTypes.object.isRequired,
};
