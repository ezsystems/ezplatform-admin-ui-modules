import React from 'react';
import PropTypes from 'prop-types';

import TableViewComponent from '../table-view/table.view.component.js';
import GridViewComponent from '../grid-view/grid.view.component.js';

import './css/sub.items.list.component.css';

const views = {
    table: TableViewComponent,
    grid: GridViewComponent,
};

const SubItemsListComponent = (props) => {
    const Component = views[props.activeView];

    return <Component {...props} />;
};

SubItemsListComponent.propTypes = {
    activeView: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    contentTypesMap: PropTypes.object.isRequired,
    handleItemPriorityUpdate: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
};

export default SubItemsListComponent;
