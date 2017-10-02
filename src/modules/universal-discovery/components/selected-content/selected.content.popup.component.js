import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupComponent from '../popup/popup.component.js';

import './css/selected.content.popup.component.css';

export default class SelectedContentPopupComponent extends Component {
    render() {
        return (
            <div className="selected-content-popup-component">
                <PopupComponent {...this.props}>
                    {this.props.children}
                </PopupComponent>
            </div>
        );
    }
}

SelectedContentPopupComponent.propTypes = {
    children: PropTypes.any.isRequired
}
