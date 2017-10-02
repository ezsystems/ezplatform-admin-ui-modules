import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ContentPreviewComponent extends Component {
    render() {
        return (
            <div className="content-preview-component">
                
            </div>
        );
    }
}

ContentPreviewComponent.propTypes = {
    data: PropTypes.object.isRequired
};
