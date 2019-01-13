import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const SearchResultsItemComponent = (props) => {
    console.warn('[DEPRECATED] SearchResultsItemComponent is deprecated');
    console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
    console.warn('[DEPRECATED] use ContentTableItemComponent instead');

    const item = props.data.ContentInfo.Content;
    const notAvailableLabel = Translator.trans(
        /*@Desc("N/A")*/ 'search.results_table.not_available.label',
        {},
        'universal_discovery_widget'
    );
    const contentType = props.contentTypesMap ? props.contentTypesMap[item.ContentType._href] : false;
    const contentTypeName = contentType ? contentType.names.value[0]['#text'] : notAvailableLabel;

    return (
        <div className="c-search-results-item">
            <div className="c-search-results-item__name" title={item.Name}>
                {item.Name}
            </div>
            <div className="c-search-results-item__type" title={contentTypeName}>
                {contentTypeName}
            </div>
            <div className="c-search-results-item__actions">
                <button type="button" className="c-search-results-item__preview-btn" onClick={() => props.onPreview(props.data)}>
                    <Icon name="view" extraClasses="ez-icon--medium ez-icon--secondary" />
                </button>
            </div>
        </div>
    );
};

SearchResultsItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
};

export default SearchResultsItemComponent;
