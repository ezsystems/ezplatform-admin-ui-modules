import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

export default class ChooseContentTypeComponent extends Component {
    constructor(props) {
        super(props);

        let selectedContentType = {};
        const { allowedContentTypes, preselectedContentType } = props;
        const isForcedContentType = allowedContentTypes.length === 1;
        const hasPreselectedAllowedContentType = !allowedContentTypes.length || allowedContentTypes.includes(props.preselectedContentType);
        const isPreselectedContentType = preselectedContentType && hasPreselectedAllowedContentType;

        this._filterTimeout = null;

        this.updateFilterQuery = this.updateFilterQuery.bind(this);
        this.renderGroup = this.renderGroup.bind(this);
        this.renderItem = this.renderItem.bind(this);

        if (isForcedContentType) {
            selectedContentType = this.findContentType(allowedContentTypes[0]);
        } else if (isPreselectedContentType) {
            selectedContentType = this.findContentType(preselectedContentType);
        }

        this.state = {
            selectedContentType,
            filterQuery: '',
        };
    }

    componentDidMount() {
        this.props.onContentTypeSelected(this.state.selectedContentType);
    }

    findContentType(identifier) {
        let contentType = null;

        Object.values(this.props.contentTypes).forEach((group) => {
            const result = group.find((contentType) => contentType.identifier === identifier);

            if (result) {
                contentType = result;
            }
        });

        return contentType;
    }

    updateSelectedItem(selectedContentType) {
        this.props.onContentTypeSelected(selectedContentType);

        this.setState((state) => Object.assign({}, state, { selectedContentType }));
    }

    updateFilterQuery(event) {
        const filterQuery = event.target.value.toLowerCase();

        window.clearTimeout(this._filterTimeout);

        this._filterTimeout = window.setTimeout(() => {
            this.setState((state) => Object.assign({}, state, { filterQuery }));
        }, 200);
    }

    renderItem(item, index) {
        const { name, identifier } = item;
        const contentTypeIconUrl = eZ.helpers.contentType.getContentTypeIconUrl(identifier);
        const isNotSelectable = this.props.allowedContentTypes.length && !this.props.allowedContentTypes.includes(identifier);
        const attrs = {
            className: 'c-choose-content-type__group-item',
            key: index,
        };

        if (this.state.selectedContentType.identifier === identifier) {
            attrs.className = `${attrs.className} is-selected`;
        }

        if (isNotSelectable) {
            attrs.className = `${attrs.className} is-not-selectable`;
        }

        if (!isNotSelectable) {
            attrs.onClick = this.updateSelectedItem.bind(this, item);
        }

        if (this.state.filterQuery && !name.toLowerCase().includes(this.state.filterQuery)) {
            attrs.hidden = true;
        }

        return (
            <div {...attrs}>
                <div className="c-choose-content-type__group-item-icon">
                    <Icon customPath={contentTypeIconUrl} extraClasses="ez-icon--small" />
                </div>
                {name}
            </div>
        );
    }

    renderGroup(groupName, index) {
        const groupAttrs = {};

        let items = this.props.contentTypes[groupName];

        if (this.state.filterQuery && items.every((item) => !item.name.toLowerCase().includes(this.state.filterQuery))) {
            groupAttrs.hidden = true;
        }

        items = items.sort((contentType1, contentType2) => {
            const contentTypeName1 = contentType1.name.toLowerCase();
            const contentTypeName2 = contentType2.name.toLowerCase();

            return contentTypeName1.localeCompare(contentTypeName2);
        });

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
        const { maxHeight, contentTypes } = this.props;
        const selectContentTypeTitle = Translator.trans(
            /*@Desc("Select a Content Type")*/ 'content_on_the_fly.select_a_content_type.title',
            {},
            'universal_discovery_widget'
        );
        const typeToRefinePlaceholder = Translator.trans(
            /*@Desc("Type to refine")*/ 'content_on_the_fly.type_to_refine.placeholder',
            {},
            'universal_discovery_widget'
        );

        return (
            <div className="c-choose-content-type">
                <p className="c-choose-content-type__title">{selectContentTypeTitle}</p>
                <div className="c-choose-content-type__list-wrapper">
                    <input className="form-control" type="text" placeholder={typeToRefinePlaceholder} onChange={this.updateFilterQuery} />
                    <div className="c-choose-content-type__list" style={{ maxHeight: `${maxHeight - 232}px` }}>
                        {Object.keys(contentTypes).map(this.renderGroup)}
                    </div>
                </div>
            </div>
        );
    }
}

ChooseContentTypeComponent.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    contentTypes: PropTypes.object.isRequired,
    onContentTypeSelected: PropTypes.func.isRequired,
    preselectedContentType: PropTypes.string,
    allowedContentTypes: PropTypes.array.isRequired,
};
