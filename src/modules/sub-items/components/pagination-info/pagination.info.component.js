import React from 'react';
import PropTypes from 'prop-types';

import './css/pagination.info.component.css';

const PaginationInfoComponent = ({ totalCount, viewingCount }) => {
    const message = Translator.trans(
        /*@Desc("Viewing <strong>%viewingCount%</strong> out of <strong>%totalCount%</strong> sub-items")*/ 'viewing_message',
        {
            viewingCount,
            totalCount,
        },
        'sub_items'
    );

    return (
        <div className="c-pagination-info">
            <div className="c-pagination-info__text" dangerouslySetInnerHTML={{ __html: message }} />
        </div>
    );
};

PaginationInfoComponent.propTypes = {
    totalCount: PropTypes.number.isRequired,
    viewingCount: PropTypes.number.isRequired,
};

export default PaginationInfoComponent;
