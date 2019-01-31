import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

class ListItem extends Component {
    constructor(props) {
        super(props);

        this.toggleExpandedState = this.toggleExpandedState.bind(this);

        this.state = { isExpanded: false };
    }

    toggleExpandedState() {
        this.setState((state) => ({ isExpanded: !state.isExpanded }));
    }

    /**
     * Renders an icon of a content type
     *
     * @method renderIcon
     * @returns {JSX.Element}
     */
    renderIcon() {
        const { contentTypeIdentifier, selected } = this.props;
        const customPath =
            eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier) || eZ.helpers.contentType.getContentTypeIconUrl('file');
        const iconAttrs = {
            customPath,
            extraClasses: `ez-icon--small ez-icon--${selected ? 'light' : 'dark'}`,
        };

        return (
            <span className="c-list-item__icon">
                <Icon {...iconAttrs} />
            </span>
        );
    }

    render() {
        const { subItems, totalSubItems, name, children, hidden, selected } = this.props;
        const itemClassName = 'c-list-item';
        const togglerClassName = 'c-list-item__toggler';
        const itemAttrs = { className: itemClassName };
        const togglerAttrs = {
            className: togglerClassName,
            onClick: this.toggleExpandedState,
            tabIndex: -1,
        };

        if (subItems.length) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--has-sub-items`;
        }

        if (subItems.length < totalSubItems) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--can-load-more`;
        }

        if (this.state.isExpanded) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--is-expanded`;
        }

        if (hidden) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--is-hidden`;
        }

        if (selected) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--is-selected`;
            togglerAttrs.className = `${togglerAttrs.className} ${togglerClassName}--light`;
        }

        return (
            <li {...itemAttrs}>
                <a className="c-list-item__label">
                    <span {...togglerAttrs} /> {this.renderIcon()} {name}
                </a>
                {children}
            </li>
        );
    }
}

ListItem.propTypes = {
    id: PropTypes.number.isRequired,
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    contentTypeIdentifier: PropTypes.string.isRequired,
    totalSubItems: PropTypes.number.isRequired,
    subItems: PropTypes.array.isRequired,
    children: PropTypes.element,
    hidden: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
};

export default ListItem;
