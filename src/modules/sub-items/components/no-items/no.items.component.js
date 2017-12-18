import React from 'react';
import PropTypes from 'prop-types';

import './css/no.items.component.css';

const NoItemsComponent = (props) => {
    return (
        <div className="c-no-items">
            {props.labels.noItems.message}
        </div>
    );
}

NoItemsComponent.propTypes = {
    labels: PropTypes.shape({
        noItems: PropTypes.object.shape({
            message: PropTypes.string.isRequired
        }).isRequired
    })
};

export default NoItemsComponent;
