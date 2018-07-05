import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/table.view.item.component.css';

export default class TableViewItemComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            priorityValue: props.location.priority,
            priorityInputEnabled: false,
            startingPriorityValue: props.location.priority,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.priorityInputEnabled !== nextState.priorityInputEnabled;
    }

    /**
     * Enables priority input field
     *
     * @method enablePriorityInput
     * @memberof TableViewItemComponent
     */
    enablePriorityInput() {
        this.setState((state) => Object.assign({}, state, { priorityInputEnabled: true }));
    }

    /**
     * Handles priority update cancel action.
     * Restores previous value and blocks the priority input.
     *
     * @method handleCancel
     * @param {Event} event
     * @memberof TableViewItemComponent
     */
    handleCancel(event) {
        event.preventDefault();

        this.setState((state) =>
            Object.assign({}, state, {
                priorityInputEnabled: false,
                priorityValue: state.startingPriorityValue,
            })
        );
    }

    /**
     * Handles submit action.
     * Updates priority value.
     *
     * @method handleSubmit
     * @param {Event} event
     * @memberof TableViewItemComponent
     */
    handleSubmit(event) {
        event.preventDefault();

        this.props.onItemPriorityUpdate({
            location: this.props.location._href,
            priority: this._refPriorityInput.value,
        });

        this.setState((state) =>
            Object.assign({}, state, {
                priorityValue: this._refPriorityInput.value,
                priorityInputEnabled: false,
                startingPriorityValue: this._refPriorityInput.value,
            })
        );
    }

    /**
     * Stores priority value
     *
     * @method storePriorityValue
     * @param {Event} event
     * @memberof TableViewItemComponent
     */
    storePriorityValue(event) {
        event.preventDefault();

        this.setState((state) => Object.assign({}, state, { priorityValue: this._refPriorityInput.value }));
    }

    /**
     * Handles edit action.
     *
     * @method handleEdit
     * @memberof TableViewItemComponent
     */
    handleEdit() {
        this.props.handleEditItem(this.props.content);
    }

    /**
     * Renders a priority cell with input field
     *
     * @method renderPriorityCell
     * @returns {Element}
     * @memberof TableViewItemComponent
     */
    renderPriorityCell() {
        const inputAttrs = {
            type: 'number',
            defaultValue: this.state.priorityValue,
            onChange: this.storePriorityValue.bind(this),
        };
        const priorityWrapperAttrs = {};
        const innerWrapperAttrs = {};

        if (!this.state.priorityInputEnabled) {
            inputAttrs.disabled = true;
            inputAttrs.value = this.state.priorityValue;
            priorityWrapperAttrs.onClick = this.enablePriorityInput.bind(this);
            priorityWrapperAttrs.className = 'c-table-view-item__inner-wrapper--disabled';
            innerWrapperAttrs.hidden = true;
        }

        return (
            <td className="c-table-view-item__cell--priority">
                <div className="c-table-view-item__priority-wrapper" {...priorityWrapperAttrs}>
                    <div className="c-table-view-item__inner-wrapper c-table-view-item__inner-wrapper--input">
                        <input
                            className="c-table-view-item__priority-value"
                            ref={(ref) => (this._refPriorityInput = ref)}
                            {...inputAttrs}
                        />
                    </div>
                    <div className="c-table-view-item__priority-actions" {...innerWrapperAttrs}>
                        <button className="c-table-view-item__btn--submit" onClick={this.handleSubmit.bind(this)}>
                            <svg className="ez-icon">
                                <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#checkmark" />
                            </svg>
                        </button>
                        <button className="c-table-view-item__btn--cancel" onClick={this.handleCancel.bind(this)}>
                            <svg className="ez-icon">
                                <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#discard" />
                            </svg>
                        </button>
                    </div>
                </div>
            </td>
        );
    }

    /**
     * Renders a translation item
     *
     * @method renderTranslation
     * @returns {Element}
     * @memberof TableViewItemComponent
     */
    renderTranslation(translation, index) {
        return (
            <span key={index} className="c-table-view-item__translation">
                {translation}
            </span>
        );
    }

    render() {
        const { content, location, contentTypesMap, labels, generateLink, languages } = this.props;
        const date = new Date(content.lastModificationDate);
        const contentType = contentTypesMap[content.ContentType._href];
        const contentTypeName = contentType ? contentType.names.value[0]['#text'] : labels.notAvailable;
        const linkAttrs = {
            className: 'c-table-view-item__link c-table-view-item__text-wrapper',
            title: content.Name,
            href: generateLink(location.id),
        };
        const translations = content.CurrentVersion.Version.VersionInfo.VersionTranslationInfo.Language.map((langauge) => {
            return languages.mappings[langauge.languageCode].name;
        });

        return (
            <tr className="c-table-view-item">
                <td className="c-table-view-item__cell--name">
                    <a {...linkAttrs}>{content.Name}</a>
                </td>
                <td className="c-table-view-item__cell--modified">
                    <div className="c-table-view-item__text-wrapper">
                        {date.toLocaleDateString()}
                        <br />
                        {date.toLocaleTimeString()}
                    </div>
                </td>
                <td className="c-table-view-item__cell--content-type">
                    <div className="c-table-view-item__text-wrapper">{contentTypeName}</div>
                </td>
                {this.renderPriorityCell()}
                <td className="c-table-view-item__cell--translations">{translations.map(this.renderTranslation)}</td>
                <td className="c-table-view-item__cell--actions">
                    <div>
                        <span title={labels.edit} onClick={this.handleEdit.bind(this)} className="c-table-view-item__btn--edit">
                            <div className="c-table-view-item__btn-inner">
                                <svg className="ez-icon">
                                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#edit" />
                                </svg>
                            </div>
                        </span>
                    </div>
                </td>
            </tr>
        );
    }
}

TableViewItemComponent.propTypes = {
    content: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemPriorityUpdate: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        edit: PropTypes.string.isRequired,
        notAvailable: PropTypes.string.isRequired,
    }).isRequired,
    handleEditItem: PropTypes.func.isRequired,
    generateLink: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
};
