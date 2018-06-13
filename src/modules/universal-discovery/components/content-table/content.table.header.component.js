import React from 'react';
import PropTypes from 'prop-types';

import './css/content.table.header.component.css';

const ContentTableHeaderComponent = (props) => {
    const { name, type } = props.labels.contentTableHeader;

    return (
        <div className="c-content-table-header__list-headers">
            <div className="c-content-table-header__list-header--name">{name}</div>
            <div className="c-content-table-header__list-header--type">{type}</div>
            <div className="c-content-table-header__list-header--span" />
        </div>
    );
};

ContentTableHeaderComponent.propTypes = {
    labels: PropTypes.shape({
        contentTableHeader: PropTypes.shape({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default ContentTableHeaderComponent;
