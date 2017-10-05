import React from 'react';
import PropTypes from 'prop-types';

import './css/progress.bar.component.css';

const ProgressBarComponent = (props) => {
    return (
        <div className="c-progress-bar">
            <div className="c-progress-bar__progress-value" style={{width:`${props.progress}%`}}></div>
            <div className="c-progress-bar__progress-label">{`${props.progress}%`}</div>
            <div className="c-progress-bar__progress-uploaded">{props.uploaded} of {props.total}</div>
        </div>
    );
}

ProgressBarComponent.propTypes = {
    progress: PropTypes.number.isRequired,
    uploaded: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired
};

export default ProgressBarComponent;
