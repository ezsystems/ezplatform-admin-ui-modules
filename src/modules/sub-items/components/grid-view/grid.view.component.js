import React from 'react';
import PropTypes from 'prop-types';

import GridViewItemComponent from './grid.view.item.component';
import NoItemsComponent from '../no-items/no.items.component';

import './css/grid.view.component.css';

const GridViewComponent = (props) => {
    const { items, contentTypesMap, generateLink } = props;

    if (!items.length) {
        return (
            <div className="c-grid-view">
                <NoItemsComponent />
            </div>
        );
    }

    return (
        <div className="c-grid-view">
            {items.map((data) => (
                <GridViewItemComponent key={data.location.id} {...data} contentTypesMap={contentTypesMap} generateLink={generateLink} />
            ))}
        </div>
    );
};
GridViewComponent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    contentTypesMap: PropTypes.object,
    generateLink: PropTypes.func.isRequired,
};

export default GridViewComponent;
