import React from 'react';
import PropTypes from 'prop-types';

import PopupComponent from '../../../common/tooltip-popup/tooltip.popup.component';

const SelectedContentPopupComponent = (props) => {
    return (
        <div className="c-selected-content-popup">
            <PopupComponent {...props}>{props.children}</PopupComponent>
        </div>
    );
};

SelectedContentPopupComponent.propTypes = {
    children: PropTypes.any.isRequired,
};

export default SelectedContentPopupComponent;
