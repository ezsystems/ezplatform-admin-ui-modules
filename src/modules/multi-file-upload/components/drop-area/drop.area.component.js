import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { fileSizeToString } from '../../helpers/text.helper';

export default class DropAreaComponent extends Component {
    constructor(props) {
        super(props);

        this._refFileInput = null;

        this.openFileSelector = this.openFileSelector.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

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
        this.props.onDrop(this.props.processUploadedFiles(event));
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
        const maxFileSizeMessage = Translator.trans(/*@Desc("Max file size:")*/ 'max_file_size.message', {}, 'multi_file_upload');
        const dropActionMessage = Translator.trans(
            /*@Desc("Drag and drop your files on browser window or upload them")*/ 'drop_action.message',
            {},
            'multi_file_upload'
        );
        const uploadBtnLabel = Translator.trans(/*@Desc("Upload sub-items")*/ 'upload_btn.label', {}, 'multi_file_upload');

        return (
            <form className="c-drop-area" multiple onDrop={this.handleUpload}>
                <div className="c-drop-area__message c-drop-area__message--main">{dropActionMessage}</div>
                <div className="c-drop-area__btn-select" onClick={this.openFileSelector}>
                    <svg className="c-drop-area__icon ez-icon ez-icon--light ez-icon--small-medium">
                        <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#upload" />
                    </svg>
                    {uploadBtnLabel}
                </div>
                <div className="c-drop-area__message c-drop-area__message--filesize">
                    ({maxFileSizeMessage} {fileSizeToString(this.props.maxFileSize)})
                </div>
                <input
                    className="c-drop-area__input--hidden"
                    ref={(ref) => (this._refFileInput = ref)}
                    id="mfu-files"
                    type="file"
                    name="files[]"
                    hidden
                    multiple
                    onChange={this.handleUpload}
                />
            </form>
        );
    }
}

DropAreaComponent.propTypes = {
    onDrop: PropTypes.func.isRequired,
    maxFileSize: PropTypes.number.isRequired,
    processUploadedFiles: PropTypes.func.isRequired,
    preventDefaultAction: PropTypes.func.isRequired,
};
