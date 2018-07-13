import React from 'react';
import PropTypes from 'prop-types';

const ViewSwitcherButton = ({ id, icon, title, onClick, activeView, isDisabled }) => {
    const baseClassName = 'c-grid-switcher__option';
    const attrs = {
        id,
        onClick: () => onClick(id),
        className: baseClassName,
        title,
    };

    if (activeView === id) {
        attrs.className = `${baseClassName} ${baseClassName}--active`;
    }

    if (isDisabled) {
        attrs.className = `${attrs.className} ${baseClassName}--disabled`;
    }

    return (
        <div {...attrs}>
            <svg className="ez-icon">
                <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${icon}`} />
            </svg>
        </div>
    );
};

ViewSwitcherButton.propTypes = {
    id: PropTypes.string.isRequired,
    activeView: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ViewSwitcherButton;
