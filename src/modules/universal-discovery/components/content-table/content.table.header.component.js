import React from 'react';
import PropTypes from 'prop-types';

import './css/content.table.header.component.css';

const ContentTableHeaderComponent = (props) => {
    const { name, type } = props.labels;

    return (
        <div className="c-content-table-header__list-headers">
            <div className="c-content-table-header__list-header--name">{name}</div>
            <div className="c-content-table-header__list-header--type">{type}</div>
            <div className="c-content-table-header__list-header--span"></div>
        </div>
    );
};

ContentTableHeaderComponent.propTypes = {
    labels: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }).isRequired
};

export default ContentTableHeaderComponent;
