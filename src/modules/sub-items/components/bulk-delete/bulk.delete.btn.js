import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Popup from '../../../common/popup/popup.component';
import { bulkDeleteContents } from './../../services/bulk.service.js';

import './css/bulk.delete.btn.css';

class BulkDeleteButton extends PureComponent {
    constructor(props) {
        super(props);

        this.onBtnClick = this.onBtnClick.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.onPopupConfirm = this.onPopupConfirm.bind(this);
        this.afterBulkDelete = this.afterBulkDelete.bind(this);

        this.modalContainer = null;

        this.state = {
            isPopupVisible: false,
        };
    }

    componentDidMount() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.classList.add('c-bulk-delete-btn__modal-container');
        document.body.appendChild(this.modalContainer);
    }

    componentWillUnmount() {
        document.body.removeChild(this.modalContainer);
    }

    onBtnClick() {
        this.togglePopup(true);
    }

    bulkDelete() {
        const { restInfo, selectedItems: itemsToDelete } = this.props;
        const locationsToDelete = itemsToDelete.map((item) => item.location);

        bulkDeleteContents(restInfo, locationsToDelete, this.afterBulkDelete);
    }

    afterBulkDelete(deletedLocations, notDeleted) {
        const { removeItemsFromList } = this.props;
        const deletedLocationsIds = new Set(deletedLocations.map((location) => location.id));

        removeItemsFromList(deletedLocationsIds);

        if (deletedLocations.length) {
            const message = Translator.trans(
                /*@Desc("The selected content item(s) have been sent to trash")*/ 'bulk_delete.success.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showSuccessNotification(message);
        }

        if (notDeleted.length) {
            const message = Translator.trans(
                /*@Desc("You do not have permission to delete at least 1 of the selected content item(s). Please contact your Administrator to obtain permissions.")*/ 'bulk_delete.error.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showErrorNotification(message);
        }
    }

    togglePopup(show) {
        this.setState(() => ({
            isPopupVisible: show,
        }));
    }

    closePopup() {
        this.togglePopup(false);
    }

    onPopupConfirm() {
        this.closePopup();
        this.bulkDelete();
    }

    renderConfirmationPopupFooter() {
        const cancelLabel = Translator.trans(/*@Desc("Cancel")*/ 'bulk_delete.popup.cancel', {}, 'sub_items');
        const confirmLabel = Translator.trans(/*@Desc("Send to trash")*/ 'bulk_delete.popup.confirm', {}, 'sub_items');

        return (
            <Fragment>
                <button
                    onClick={this.closePopup}
                    type="button"
                    className="btn btn-secondary btn--no c-bulk-delete-btn__cancel-btn"
                    data-dismiss="modal"
                >
                    {cancelLabel}
                </button>
                <button onClick={this.onPopupConfirm} type="button" className="btn btn-danger font-weight-bold btn--trigger">
                    {confirmLabel}
                </button>
            </Fragment>
        );
    }

    renderConfirmationPopup() {
        const { isPopupVisible } = this.state;

        if (!isPopupVisible) {
            return null;
        }

        const confirmationMessage = Translator.trans(
            /*@Desc("Are you sure you want to send the selected content item(s) to trash?")*/ 'bulk_delete.popup.message',
            {},
            'sub_items'
        );

        return ReactDOM.createPortal(
            <Popup
                onClose={this.closePopup}
                isVisible={isPopupVisible}
                isLoading={false}
                size="medium"
                footerChildren={this.renderConfirmationPopupFooter()}
                noHeader={true}
            >
                <div className="c-bulk-delete-btn__modal-body">{confirmationMessage}</div>
            </Popup>,
            this.modalContainer
        );
    }

    render() {
        const { selectedItems } = this.props;
        const label = Translator.trans(/*@Desc("Delete selected items")*/ 'trash_btn.label', {}, 'sub_items');
        const disabled = !selectedItems.length;
        const baseClassName = 'm-sub-items__btn';
        let className = `${baseClassName} ${baseClassName}--trash`;

        className = disabled ? `${className} ${baseClassName}--disabled` : className;

        return (
            <Fragment>
                <div className={className} title={label} onClick={this.onBtnClick}>
                    <svg className="ez-icon ez-icon--medium">
                        <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#trash" />
                    </svg>
                </div>
                {this.renderConfirmationPopup()}
            </Fragment>
        );
    }
}

BulkDeleteButton.propTypes = {
    selectedItems: PropTypes.array.isRequired,
    removeItemsFromList: PropTypes.func.isRequired,
    parentLocationId: PropTypes.number.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
};

export default BulkDeleteButton;
