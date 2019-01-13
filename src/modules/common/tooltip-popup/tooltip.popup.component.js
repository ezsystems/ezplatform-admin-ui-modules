import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';

const TooltipPopupComponent = (props) => {
    const attrs = {
        className: 'c-tooltip-popup',
        hidden: !props.visible,
    };

    return (
        <div {...attrs}>
            <div className="c-tooltip-popup__header">
                <div className="c-tooltip-popup__title">{props.title}</div>
                <div className="c-tooltip-popup__close" onClick={props.onClose} tabIndex="-1">
                    <Icon name="discard" extraClasses="ez-icon--medium" />
                </div>
            </div>
            <div className="c-tooltip-popup__content">{props.children}</div>
        </div>
    );
};

TooltipPopupComponent.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

TooltipPopupComponent.defaultProps = {
    onClose: () => {},
};

export default TooltipPopupComponent;
