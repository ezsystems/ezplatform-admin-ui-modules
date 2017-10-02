import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/popup.component.css';

export default class PopupComponent extends Component {
    constructor() {
        super();

        this.state = {
            items: [],
            visible: false
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {visible: props.visible}));
    }

    hidePopup() {
        this.setState(state => Object.assign({}, state, {visible: false}));
    }

    render() {
        const attrs = {
            className: 'popup-component',
            hidden: !this.state.visible
        };

        return (
            <div {...attrs}>
                <h3 className="popup-component__title">{this.props.title}</h3>
                <div className="popup-component__content">
                    {this.props.children}
                </div>
                <button className="popup-component__close" onClick={this.hidePopup.bind(this)}>X</button>
            </div>
        );
    }
}

PopupComponent.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any,
    visible: PropTypes.bool
};
