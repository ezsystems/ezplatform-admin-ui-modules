import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { bulkMoveLocations } from './../../services/bulk.service.js';

import './css/bulk.move.btn.css';

class BulkMoveButton extends PureComponent {
    constructor(props) {
        super(props);

        this.onBtnClick = this.onBtnClick.bind(this);
        this.closeUdw = this.closeUdw.bind(this);
        this.onUdwConfirm = this.onUdwConfirm.bind(this);

        this.state = {
            isUdwOpened: false,
        };
    }

    componentDidMount() {
        this.udwContainer = document.getElementById('react-udw');
    }

    onBtnClick() {
        this.toggleUdw(true);
    }

    bulkMove(location) {
        const { restInfo, selectedItems: itemsToMove } = this.props;
        const contentsToMove = itemsToMove.map((item) => item.location);

        bulkMoveLocations(restInfo, contentsToMove, location, this.afterBulkMove.bind(this, location));
    }

    afterBulkMove(location, movedLocations, notMoved) {
        const { removeItemsFromList } = this.props;
        const movedContentsIds = movedLocations.map((content) => content.id);

        removeItemsFromList((item) => movedContentsIds.includes(item.location.id));

        if (notMoved.length) {
            const message = Translator.trans(
                /*@Desc("You do not have permission to move at least 1 of the selected content item(s). Please contact your Administrator to obtain permissions.")*/ 'bulk_move.error.message',
                {},
                'sub_items'
            );

            window.eZ.helpers.notification.showErrorNotification(message);
        }

        if (movedLocations.length) {
            const message = Translator.trans(
                /*@Desc("The selected content item(s) have been sent to <u>%location_name%</u>")*/ 'bulk_move.success.message',
                { location_name: location.ContentInfo.Content.Name },
                'sub_items'
            );

            window.eZ.helpers.notification.showSuccessNotification(message);
        }
    }

    toggleUdw(show) {
        this.setState(() => ({
            isUdwOpened: show,
        }));
    }

    closeUdw() {
        this.toggleUdw(false);
    }

    onUdwConfirm([selectedLocation]) {
        this.closeUdw();
        this.bulkMove(selectedLocation);
    }

    renderUdw() {
        const { isUdwOpened } = this.state;

        if (!isUdwOpened) {
            return null;
        }

        const UniversalDiscovery = window.eZ.modules.UniversalDiscovery;
        const { restInfo, parentLocationId, selectedItems } = this.props;
        const selectedItemsLocationsIds = selectedItems.map((item) => item.location.id);
        const excludedMoveLocations = [parentLocationId, ...selectedItemsLocationsIds];
        const title = Translator.trans(/*@Desc("Choose location")*/ 'udw.choose_location.title', {}, 'sub_items');
        const udwProps = {
            title,
            restInfo,
            onCancel: this.closeUdw,
            onConfirm: this.onUdwConfirm,
            canSelectContent: ({ item }, callback) => {
                callback(!excludedMoveLocations.includes(item.id));
            },
            multiple: false,
            allowContainersOnly: true,
        };

        return ReactDOM.createPortal(<UniversalDiscovery {...udwProps} />, this.udwContainer);
    }

    render() {
        const { selectedItems } = this.props;
        const label = Translator.trans(/*@Desc("Move selected items")*/ 'move_btn.label', {}, 'sub_items');
        const disabled = !selectedItems.length;
        const baseClassName = 'm-sub-items__btn';
        let className = `${baseClassName} ${baseClassName}--move`;

        className = disabled ? `${className} ${baseClassName}--disabled` : className;

        return (
            <Fragment>
                <div className={className} title={label} onClick={this.onBtnClick}>
                    <svg className="ez-icon ez-icon--medium">
                        <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#move" />
                    </svg>
                </div>
                {this.renderUdw()}
            </Fragment>
        );
    }
}

BulkMoveButton.propTypes = {
    selectedItems: PropTypes.array.isRequired,
    removeItemsFromList: PropTypes.func.isRequired,
    parentLocationId: PropTypes.number.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
};

export default BulkMoveButton;
