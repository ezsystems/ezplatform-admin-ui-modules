import React from 'react';
import PropTypes from 'prop-types';

import './css/popup.component.css';

const PopupComponent = (props) => {
    const attrs = {
        className: 'c-popup',
        hidden: !props.visible,
    };

    return (
        <div {...attrs}>
            <div className="c-popup__header">
                <div className="c-popup__title">{props.title}</div>
                <div className="c-popup__close" onClick={props.onClose}>
                    <svg className="ez-icon">
                        <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#discard" />
                    </svg>
                </div>
            </div>
            <div className="c-popup__content">{props.children}</div>
        </div>
    );
};

PopupComponent.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

PopupComponent.defaultProps = {
    onClose: () => {},
};

export default PopupComponent;
