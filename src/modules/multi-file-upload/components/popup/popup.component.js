import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconComponent from '../icon/icon.component';
import { DISCARD } from '../icon/icons.constants.json';

import './css/popup.component.css';

export default class PopupComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {visible: props.visible}));
    }

    /**
     * Hides a popup
     *
     * @method hidePopup
     * @memberof PopupComponent
     */
    hidePopup() {
        this.setState(state => Object.assign({}, state, {visible: false}));

        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

    render() {
        const attrs = {
            className: 'c-popup',
            hidden: !this.state.visible
        };

        return (
            <div {...attrs}>
                <div className="c-popup__header">
                    <div className="c-popup__title">{this.props.title}</div>
                    <div className="c-popup__close" onClick={this.hidePopup.bind(this)}><IconComponent icon={DISCARD} /></div>
                </div>
                <div className="c-popup__content">{this.props.children}</div>
            </div>
        );
    }
}

PopupComponent.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any,
    visible: PropTypes.bool,
    onClose: PropTypes.func
};

PopupComponent.defaultProps = {
    visible: false
};
