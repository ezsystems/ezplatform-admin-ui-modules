import React from 'react';
import PropTypes from 'prop-types';

const FinderLoadMoreComponent = ({ isVisible, onClick }) => {
    if (!isVisible) {
        return null;
    }

    const loadMoreLabel = Translator.trans(/*@Desc("Load more")*/ 'finder.branch.load_more.label', {}, 'universal_discovery_widget');

    return (
        <button type="button" className="c-finder-load-more" onClick={onClick}>
            {loadMoreLabel}
        </button>
    );
};

FinderLoadMoreComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default FinderLoadMoreComponent;
