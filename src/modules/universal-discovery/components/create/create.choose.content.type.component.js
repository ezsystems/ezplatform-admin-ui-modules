import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/create.choose.content.type.component.css';

export default class ChooseContentTypeComponent extends Component {
    constructor(props) {
        super(props);

        this._filterTimeout = null;

        this.updateFilterQuery = this.updateFilterQuery.bind(this);
        this.renderGroup = this.renderGroup.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.state = {
            selected: {},
            filterQuery: ''
        };
    }

    updateSelectedItem(item) {
        this.props.onContentTypeSelected(item);

        this.setState(state => Object.assign({}, state, {selected: item}));
    }

    updateFilterQuery(event) {
        const filterQuery = event.target.value.toLowerCase();

        window.clearTimeout(this._filterTimeout);

        this._filterTimeout = window.setTimeout(() => {
            this.setState(state => Object.assign({}, state, { filterQuery }));
        }, 200);
    }

    renderItem(item, index) {
        const attrs = {
            className: 'c-choose-content-type__group-item',
            onClick: this.updateSelectedItem.bind(this, item),
            key: index
        };

        if (this.state.selected.identifier === item.identifier) {
            attrs.className = `${attrs.className} is-selected`;
        }

        if (this.state.filterQuery && !item.name.toLowerCase().includes(this.state.filterQuery)) {
            attrs.hidden = true;
        }

        return (
            <div {...attrs}>
                {item.name}
            </div>
        );
    }

    renderGroup(groupName, index) {
        const items = this.props.contentTypes[groupName];
        const groupAttrs = {};

        if (this.state.filterQuery && items.every(item => !item.name.toLowerCase().includes(this.state.filterQuery))) {
            groupAttrs.hidden = true;
        }

        return (
            <div className="c-choose-content-type__group" key={index}>
                <div className="c-choose-content-type__group-name" {...groupAttrs}>
                    {groupName}
                </div>
                {items.map(this.renderItem)}
            </div>
        );
    }

    render() {
        const {labels, maxHeight, contentTypes} = this.props;

        return (
            <div className="c-choose-content-type">
                <p className="c-choose-content-type__title">{labels.contentOnTheFly.selectContentType}</p>
                <div className="c-choose-content-type__list-wrapper">
                    <input className="form-control" type="text" placeholder={labels.contentOnTheFly.typeToRefine} onChange={this.updateFilterQuery} />
                    <div className="c-choose-content-type__list" style={{maxHeight:`${maxHeight - 232}px`}}>
                        {Object.keys(contentTypes).map(this.renderGroup)}
                    </div>
                </div>
            </div>
        );
    }
}

ChooseContentTypeComponent.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    labels: PropTypes.object.isRequired,
    contentTypes: PropTypes.object.isRequired,
    onContentTypeSelected: PropTypes.func.isRequired
};
