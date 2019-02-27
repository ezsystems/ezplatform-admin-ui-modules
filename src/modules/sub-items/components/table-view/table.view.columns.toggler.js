import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';
import TableViewColumnsTogglerListElement from './table.view.columns.toggler.list.element';
import { headerLabels } from './table.view.component';

export default class TableViewColumnsTogglerComponent extends Component {
    constructor(props) {
        super(props);

        this.togglePanel = this.togglePanel.bind(this);
        this.hidePanel = this.hidePanel.bind(this);

        this._refTogglerButton = createRef();

        this.state = {
            isOpen: false,
            buttonBottomDocumentOffset: null,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.hidePanel, false);

        this.setState(() => ({
            buttonBottomDocumentOffset: this.getBtnBottomDocumentOffset(),
        }));
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.hidePanel);
    }

    getBtnBottomDocumentOffset() {
        const buttonTopOffset = this._refTogglerButton.current.getBoundingClientRect().top + window.scrollY;

        return document.documentElement.scrollHeight - buttonTopOffset;
    }

    hidePanel({ target }) {
        if (!this.state.isOpen) {
            return;
        }

        const isClickInsideToggler = target.closest('.c-table-view-columns-toggler');

        if (!isClickInsideToggler) {
            this.setState(() => ({
                isOpen: false,
            }));
        }
    }

    togglePanel() {
        this.setState((state) => ({
            isOpen: !state.isOpen,
        }));
    }

    renderPanel() {
        if (!this.state.isOpen) {
            return null;
        }

        const { columnsVisibility, toggleColumnVisibility } = this.props;
        const panelAttrs = { className: 'c-table-view-columns-toggler__panel' };

        if (this.state.buttonBottomDocumentOffset < 200) {
            panelAttrs.className = `${panelAttrs.className} ${panelAttrs.className}--above-btn`;
        }

        return (
            <div {...panelAttrs}>
                <ul className="c-table-view-columns-toggler__list">
                    {Object.entries(columnsVisibility).map(([columnKey, isColumnVisible]) => {
                        const label = headerLabels[columnKey];

                        return (
                            <TableViewColumnsTogglerListElement
                                key={columnKey}
                                label={label}
                                columnKey={columnKey}
                                isColumnVisible={isColumnVisible}
                                toggleColumnVisibility={toggleColumnVisibility}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    }

    render() {
        return (
            <div className="c-table-view-columns-toggler">
                <button
                    ref={this._refTogglerButton}
                    type="button"
                    className="btn btn-dark c-table-view-columns-toggler__btn"
                    onClick={this.togglePanel}>
                    <Icon name="filters" extraClasses="ez-icon--small ez-icon--light" />
                </button>
                {this.renderPanel()}
            </div>
        );
    }
}

TableViewColumnsTogglerComponent.propTypes = {
    columnsVisibility: PropTypes.object.isRequired,
    toggleColumnVisibility: PropTypes.func.isRequired,
};
