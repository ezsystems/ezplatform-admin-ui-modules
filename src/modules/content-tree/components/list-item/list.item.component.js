import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ListItem extends Component {
    constructor(props) {
        super(props);

        this.toggleExpandedState = this.toggleExpandedState.bind(this);

        this.state = { isExpanded: false };
    }

    toggleExpandedState() {
        this.setState((state) => ({ isExpanded: !state.isExpanded }));
    }

    render() {
        const { subItems, totalSubItems, name, children } = this.props;
        const itemClassName = 'c-list-item';
        const attrs = { className: itemClassName };

        if (subItems.length) {
            attrs.className = `${attrs.className} ${itemClassName}--has-sub-items`;
        }

        if (subItems.length < totalSubItems) {
            attrs.className = `${attrs.className} ${itemClassName}--can-load-more`;
        }

        if (this.state.isExpanded) {
            attrs.className = `${attrs.className} ${itemClassName}--is-expanded`;
        }

        return (
            <li {...attrs}>
                <div className="c-list-item__label">
                    {name} <span className="c-list-item__toggler" onClick={this.toggleExpandedState} />
                </div>
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
};

export default ListItem;
