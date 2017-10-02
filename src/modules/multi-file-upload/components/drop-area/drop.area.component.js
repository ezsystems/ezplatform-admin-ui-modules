import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconComponent from '../icon/icon.component';
import { fileSizeToString } from '../../helpers/text.helper';
import { UPLOAD } from '../icon/icons.constants.json';

import './css/drop.area.component.css';

export default class DropAreaComponent extends Component {
    openFileSelector(event) {
        event.preventDefault();

        this._refFileInput.click();
    }

    handleUpload(event) {
        event.preventDefault();

        const target = event.nativeEvent.dataTransfer || event.nativeEvent.target;

        if (!target) {
            return;
        }

        const files = [...target.files].map(file => ({
            id: (Math.floor(Math.random() * Date.now())),
            file
        }));

        this.props.onDrop(files);
    }

    componentDidMount() {
        window.addEventListener('drop', this.preventDefaultAction, false);
        window.addEventListener('dragover', this.preventDefaultAction, false);
    }

    componentWillUnmount() {
        window.removeEventListener('drop', this.preventDefaultAction, false);
        window.removeEventListener('dragover', this.preventDefaultAction, false);
    }

    preventDefaultAction(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    render() {
        return (
            <form className="c-drop-area" multiple onDrop={this.handleUpload.bind(this)}>
                <div className="c-drop-area__message--main">{this.props.dropActionMessage}</div>
                <div className="c-drop-area__btn--select" onClick={this.openFileSelector.bind(this)}>
                    <IconComponent icon={UPLOAD} height={20} />
                    {this.props.uploadBtnLabel}
                </div>
                <div className="c-drop-area__message--filesize">({this.props.maxFileSizeMessage} {fileSizeToString(this.props.maxFileSize)})</div>
                <input 
                    className="c-drop-area__input--hidden" 
                    ref={ref => this._refFileInput = ref }
                    id="mfu-files" 
                    type="file" 
                    name="files[]" 
                    hidden 
                    multiple 
                    onChange={this.handleUpload.bind(this)} />
            </form>
        );
    }
}

DropAreaComponent.propTypes = {
    onDrop: PropTypes.func.isRequired,
    maxFileSize: PropTypes.number.isRequired,
    maxFileSizeMessage: PropTypes.string.isRequired,
    dropActionMessage: PropTypes.string.isRequired,
    uploadBtnLabel: PropTypes.string.isRequired
};