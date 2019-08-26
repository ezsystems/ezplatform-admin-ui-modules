import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';

import { CreateContentWidgetContext } from '../../universal.discovery.module';

const ContentCreateButton = ({ isDisabled }) => {
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const toggleContentCreateVisibility = () => {
        setCreateContentVisible((prevState) => !prevState);
    };

    return (
        <div className="c-content-create-button">
            <button className="c-content-create-button__btn btn btn-primary" disabled={isDisabled} onClick={toggleContentCreateVisibility}>
                <Icon name="create" extraClasses="ez-icon--medium ez-icon--light" />
            </button>
        </div>
    );
};

ContentCreateButton.propTypes = {
    isDisabled: PropTypes.bool,
};

ContentCreateButton.defaultProps = {
    isDisabled: false,
};

export default ContentCreateButton;
