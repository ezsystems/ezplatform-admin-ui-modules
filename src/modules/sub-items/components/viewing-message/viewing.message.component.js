import React from 'react';
import PropTypes from 'prop-types';

import './css/viewing.message.component.css';

const ViewingMessageComponent = ({ totalCount, viewingCount }) => {
    const message = Translator.trans(
        /*@Desc("Viewing <strong>%viewingCount%</strong> out of <strong>%totalCount%</strong> sub-items")*/ 'viewing_message',
        {
            viewingCount,
            totalCount,
        },
        'sub_items'
    );

    return (
        <div className="c-viewing-message">
            <div className="c-viewing-message__text" dangerouslySetInnerHTML={{ __html: message }} />
        </div>
    );
};

ViewingMessageComponent.propTypes = {
    totalCount: PropTypes.number.isRequired,
    viewingCount: PropTypes.number.isRequired,
};

export default ViewingMessageComponent;
