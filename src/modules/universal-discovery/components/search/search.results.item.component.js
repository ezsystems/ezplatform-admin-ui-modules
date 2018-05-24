import React from 'react';
import PropTypes from 'prop-types';

import './css/search.results.item.component.css';

const SearchResultsItemComponent = (props) => {
    console.warn('[DEPRECATED] SearchResultsItemComponent is deprecated');
    console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
    console.warn('[DEPRECATED] use ContentTableItemComponent instead');

    const item = props.data.ContentInfo.Content;
    const contentType = props.contentTypesMap ? props.contentTypesMap[item.ContentType._href] : false;
    const contentTypeName = contentType ? contentType.names.value[0]['#text'] : props.labels.notAvailable;

    return (
        <div className="c-search-results-item">
            <div className="c-search-results-item__name" title={item.Name}>{item.Name}</div>
            <div className="c-search-results-item__type" title={contentTypeName}>{contentTypeName}</div>
            <div className="c-search-results-item__actions">
                <button className="c-search-results-item__btn--preview" onClick={() => props.onPreview(props.data)}>
                    <svg className="ez-icon">
                        <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#view"></use>
                    </svg>
                </button>
            </div>
        </div>
    );
};

SearchResultsItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    labels: PropTypes.shape({
        notAvailable: PropTypes.string.isRequired
    }).isRequired
};

export default SearchResultsItemComponent;
