import React from 'react';
import PropTypes from 'prop-types';

const TEXT_LOAD_MORE = Translator.trans(/*@Desc("Load more")*/ 'finder.branch.load_more.label', {}, 'universal_discovery_widget');

const FinderLoadMoreComponent = ({ isVisible, onClick }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <button type="button" className="c-finder-load-more" onClick={onClick}>
            {TEXT_LOAD_MORE}
        </button>
    );
};

FinderLoadMoreComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default FinderLoadMoreComponent;
