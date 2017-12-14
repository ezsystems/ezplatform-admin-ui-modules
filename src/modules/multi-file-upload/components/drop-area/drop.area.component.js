import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { fileSizeToString } from '../../helpers/text.helper';

import './css/drop.area.component.css';

export default class DropAreaComponent extends Component {
    /**
     * Opens a browser native file selector
     *
     * @method openFileSelector
     * @param {Event} event
     * @memberof DropAreaComponent
     */
    openFileSelector(event) {
        event.preventDefault();

        this._refFileInput.click();
    }

    /**
     * Handles file upload
     *
     * @method handleUpload
     * @param {Event} event
     * @memberof DropAreaComponent
     */
    handleUpload(event) {
        this.props.preventDefaultAction(event);
        this.props.onDrop(this.props.proccessUploadedFiles(event));
    }

    componentDidMount() {
        window.addEventListener('drop', this.props.preventDefaultAction, false);
        window.addEventListener('dragover', this.props.preventDefaultAction, false);
    }

    componentWillUnmount() {
        window.removeEventListener('drop', this.props.preventDefaultAction, false);
        window.removeEventListener('dragover', this.props.preventDefaultAction, false);
    }

    render() {
        return (
            <form className="c-drop-area" multiple onDrop={this.handleUpload.bind(this)}>
                <div className="c-drop-area__message--main">{this.props.dropActionMessage}</div>
                <div className="c-drop-area__btn--select" onClick={this.openFileSelector.bind(this)}>
                    <svg className="ez-icon">
                        <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#upload"></use>
                    </svg>
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
    uploadBtnLabel: PropTypes.string.isRequired,
    proccessUploadedFiles: PropTypes.func.isRequired,
    preventDefaultAction: PropTypes.func.isRequired
};
