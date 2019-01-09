import React from 'react';
import PropTypes from 'prop-types';

import TableViewComponent from '../table-view/table.view.component.js';
import GridViewComponent from '../grid-view/grid.view.component.js';

import './css/sub.items.list.component.css';

const translationsOfSortNames = {
    'LocationPriority': 'priority',
    'ContentName': 'name',
    'DateModified': 'date'
}

const views = {
    table: {
        component: TableViewComponent,
        propsTransformer: (props) => {

            const sortBy = Object.keys(props.sortClauses)[0];

            props.sortKey = translationsOfSortNames[sortBy] || 'name';
            props.isAscSort = props.sortClauses[sortBy] == 'ascending';
            delete props.sortClauses;

            return props;
        }
    },
    grid: {
        component: GridViewComponent,
        propsTransformer: (props) => { return props; }
    }
};

const SubItemsListComponent = (props) => {
    const Component = views[props.activeView]['component'];
    const attributes = views[props.activeView]['propsTransformer'](props);

    return <Component {...attributes} />;
};

SubItemsListComponent.propTypes = {
    activeView: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    contentTypesMap: PropTypes.object.isRequired,
    handleItemPriorityUpdate: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
};

export default SubItemsListComponent;
