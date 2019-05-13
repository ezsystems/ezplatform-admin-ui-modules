import React, { useRef, useEffect, useCallback, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';
import { createCssClassNames } from '../css-class-names/css.class.names';

const TEXT_CLOSE_BTN = Translator.trans(/*@Desc("Close")*/ 'popup.close.label', {}, 'popup_component');
const KEY_CODE_ESC = 27;
const CLASS_NON_SCROLLABLE = 'ezs-non-scrollable';
const CLASS_MODAL_OPEN = 'modal-open';
const MODAL_CONFIG = {
    backdrop: 'static',
    keyboard: true,
};
const MODAL_SIZE_CLASS = {
    small: 'modal-sm',
    medium: '',
    large: 'modal-lg',
};

const Popup = (props) => {
    const { footerChildren, additionalClasses, size, noHeader, children } = props;
    const { hasFocus, onClose, title, subtitle } = props;
    const [isVisible, setIsVisible] = useState(props.isVisible);
    const refModal = useRef(null);
    const handleClose = useCallback(() => setIsVisible(false), []);
    const onKeyUp = useCallback(({ originalEvent }) => {
        const escKeyPressed = originalEvent && (originalEvent.which === KEY_CODE_ESC || originalEvent.keyCode === KEY_CODE_ESC);

        if (escKeyPressed) {
            setIsVisible(false);
        }
    }, []);
    const renderHeader = () => {
        return (
            <div className={'modal-header c-popup__header'}>
                {renderHeadline()}
                <button
                    type="button"
                    className="close c-popup__btn--close"
                    data-dismiss="modal"
                    aria-label={TEXT_CLOSE_BTN}
                    onClick={handleClose}>
                    <Icon name="discard" extraClasses="ez-icon--medium" />
                </button>
            </div>
        );
    };
    const renderHeadline = () => {
        if (!title) {
            return null;
        }

        return (
            <h3 className="modal-title c-popup__headline" title={title}>
                <span className="c-popup__title">{title}</span>
                {renderSubtitle()}
            </h3>
        );
    };
    const renderSubtitle = () => {
        if (!subtitle) {
            return null;
        }

        return <span className="c-popup__subtitle">{subtitle}</span>;
    };
    const renderFooter = () => {
        if (!footerChildren) {
            return;
        }

        return <div className={'modal-footer c-popup__footer'}>{footerChildren}</div>;
    };
    const modalAttrs = {
        className: createCssClassNames({
            'c-popup modal fade': true,
            [additionalClasses]: !!additionalClasses,
            'c-popup--no-header': !!noHeader,
        }),
        ref: refModal,
        tabIndex: hasFocus ? -1 : undefined,
    };

    useEffect(() => {
        const modal = $(refModal.current);

        modal.modal({ ...MODAL_CONFIG, isVisible, focus: hasFocus });

        if (isVisible) {
            window.document.body.classList.add(CLASS_MODAL_OPEN, CLASS_NON_SCROLLABLE);

            modal.on('keyup', onKeyUp);
            modal.one('hidden.bs.modal', onClose);
        } else {
            modal.modal('hide');

            window.document.body.classList.remove(CLASS_MODAL_OPEN, CLASS_NON_SCROLLABLE);

            modal.off('keyup', onKeyUp);
            modal.off('hidden.bs.modal', onClose);

            onClose();
        }
    }, [hasFocus, isVisible, onClose, onKeyUp]);

    return (
        <div {...modalAttrs}>
            <div className={`modal-dialog c-popup__dialog ${MODAL_SIZE_CLASS[size]}`} role="dialog">
                <div className="modal-content c-popup__content">
                    {renderHeader()}
                    <div className="modal-body c-popup__body">{children}</div>
                    {renderFooter()}
                </div>
            </div>
        </div>
    );
};

Popup.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    isVisible: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    hasFocus: PropTypes.bool,
    additionalClasses: PropTypes.string,
    footerChildren: PropTypes.element,
    size: PropTypes.string,
    noHeader: PropTypes.bool,
};

Popup.defaultProps = {
    isVisible: false,
    isLoading: true,
    hasFocus: true,
    size: 'large',
    noHeader: false,
    additionalClasses: null,
    footerChildren: null,
    title: null,
    subtitle: null,
};

export default Popup;
