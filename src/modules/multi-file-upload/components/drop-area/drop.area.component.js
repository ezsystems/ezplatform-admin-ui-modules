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

        const min = 0;
        const max = Date.now();
        const files = [...target.files].map(file => ({
            id: (Math.floor(Math.random() * (max - min + 1)) + min),
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
                <div className="c-drop-area__message--main">{this.props.mainMessage}</div>
                <div className="c-drop-area__btn--select" onClick={this.openFileSelector.bind(this)}>
                    <IconComponent icon={UPLOAD} height={20} />
                    Upload sub-items
                </div>
                <div className="c-drop-area__message--filesize">(Max file size: {fileSizeToString(this.props.maxFileSize)})</div>
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
    mainMessage: PropTypes.string,
    extraMessage: PropTypes.string,
};

DropAreaComponent.defaultProps = {
    mainMessage: 'Drag and drop your files on browser window or upload them',
    maxFileSize: 0
};