import React from 'react';

import Icon from '../../../common/icon/icon';

const ContentCreate = () => {
    return (
        <div className="c-content-create">
            <button className="c-content-create__btn btn btn-primary">
                <Icon name="create" extraClasses="ez-icon--medium ez-icon--light" />
            </button>
        </div>
    );
};

export default ContentCreate;
