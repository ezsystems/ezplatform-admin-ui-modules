import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

export default class TableViewItemComponent extends PureComponent {
    constructor(props) {
        super(props);

        this.storePriorityValue = this.storePriorityValue.bind(this);
        this.enablePriorityInput = this.enablePriorityInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.onSelectCheckboxChange = this.onSelectCheckboxChange.bind(this);
        this.setPriorityInputRef = this.setPriorityInputRef.bind(this);

        this._refPriorityInput = null;

        this.state = {
            priorityValue: props.location.priority,
            priorityInputEnabled: false,
            startingPriorityValue: props.location.priority,
        };
    }

    /**
     * Enables priority input field
     *
     * @method enablePriorityInput
     * @memberof TableViewItemComponent
     */
    enablePriorityInput() {
        this.setState(() => ({ priorityInputEnabled: true }));
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

        this.setState((state) => ({
            priorityInputEnabled: false,
            priorityValue: state.startingPriorityValue,
        }));
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

        this.setState(() => ({
            priorityValue: this._refPriorityInput.value,
            priorityInputEnabled: false,
            startingPriorityValue: this._refPriorityInput.value,
        }));
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

        this.setState(() => ({ priorityValue: this._refPriorityInput.value }));
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

    setPriorityInputRef(ref) {
        this._refPriorityInput = ref;
    }

    /**
     * Renders a priority cell with input field
     *
     * @method renderPriorityCell
     * @returns {JSX.Element}
     * @memberof TableViewItemComponent
     */
    renderPriorityCell() {
        const inputAttrs = {
            type: 'number',
            defaultValue: this.state.priorityValue,
            onChange: this.storePriorityValue,
        };
        const priorityWrapperAttrs = {};
        const innerWrapperAttrs = {};

        if (!this.state.priorityInputEnabled) {
            inputAttrs.disabled = true;
            delete inputAttrs.defaultValue;
            inputAttrs.value = this.state.priorityValue;
            priorityWrapperAttrs.onClick = this.enablePriorityInput;
            priorityWrapperAttrs.className = 'c-table-view-item__inner-wrapper c-table-view-item__inner-wrapper--disabled';
            innerWrapperAttrs.hidden = true;
        }

        return (
            <td className="c-table-view-item__cell c-table-view-item__cell--priority">
                <div className="c-table-view-item__priority-wrapper" {...priorityWrapperAttrs}>
                    <div className="c-table-view-item__inner-wrapper c-table-view-item__inner-wrapper--input">
                        <input className="c-table-view-item__priority-value" ref={this.setPriorityInputRef} {...inputAttrs} />
                    </div>
                    <div className="c-table-view-item__priority-actions" {...innerWrapperAttrs}>
                        <button type="button" className="c-table-view-item__btn c-table-view-item__btn--submit" onClick={this.handleSubmit}>
                            <Icon name="checkmark" extraClasses="ez-icon--medium ez-icon--light" />
                        </button>
                        <button type="button" className="c-table-view-item__btn c-table-view-item__btn--cancel" onClick={this.handleCancel}>
                            <Icon name="discard" extraClasses="ez-icon--medium ez-icon--light" />
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
     * @returns {JSX.Element}
     * @memberof TableViewItemComponent
     */
    renderTranslation(translation, index) {
        return (
            <span key={index} className="c-table-view-item__translation">
                {translation}
            </span>
        );
    }

    /**
     * Calls onItemSelect callback for given item
     *
     * @param {Event} event
     */
    onSelectCheckboxChange(event) {
        const { location, content, onItemSelect } = this.props;
        const isSelected = event.target.checked;

        onItemSelect({ content, location }, isSelected);
    }

    render() {
        const { content, location, isSelected, contentTypesMap, generateLink, languages } = this.props;
        const notAvailableLabel = Translator.trans(/*@Desc("N/A")*/ 'content_type.not_available.label', {}, 'sub_items');
        const editLabel = Translator.trans(/*@Desc("Edit")*/ 'edit_item_btn.label', {}, 'sub_items');
        const { formatDateWithTimezone } = window.eZ.helpers.timezone;
        const contentType = contentTypesMap[content.ContentType._href];
        const contentTypeIdentifier = contentType ? contentType.identifier : null;
        const contentTypeName = contentTypeIdentifier ? window.eZ.adminUiConfig.contentTypeNames[contentTypeIdentifier] : notAvailableLabel;
        const linkAttrs = {
            className: 'c-table-view-item__link c-table-view-item__text-wrapper',
            title: content.Name,
            href: generateLink(location.id),
        };
        const translations = content.CurrentVersion.Version.VersionInfo.VersionTranslationInfo.Language.map((langauge) => {
            return languages.mappings[langauge.languageCode].name;
        });
        const contentTypeIconUrl = eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier);

        return (
            <tr className="c-table-view-item">
                <td className="c-table-view-item__cell c-table-view-item__cell--checkbox">
                    <input type="checkbox" checked={isSelected} onChange={this.onSelectCheckboxChange} />
                </td>
                <td className="c-table-view-item__cell c-table-view-item__cell--icon">
                    <Icon customPath={contentTypeIconUrl} extraClasses="ez-icon--medium" />
                </td>
                <td className="c-table-view-item__cell c-table-view-item__cell--name">
                    <a {...linkAttrs}>{content.Name}</a>
                </td>
                <td className="c-table-view-item__cell c-table-view-item__cell--modified">
                    <div className="c-table-view-item__text-wrapper">
                        {formatDateWithTimezone(new Date(content.lastModificationDate))}
                    </div>
                </td>
                <td className="c-table-view-item__cell c-table-view-item__cell--content-type">
                    <div className="c-table-view-item__text-wrapper">{contentTypeName}</div>
                </td>
                {this.renderPriorityCell()}
                <td className="c-table-view-item__cell c-table-view-item__cell--translations">
                    {translations.map(this.renderTranslation)}
                </td>
                <td className="c-table-view-item__cell c-table-view-item__cell--actions">
                    <span
                        title={editLabel}
                        onClick={this.handleEdit}
                        className="c-table-view-item__btn c-table-view-item__btn--edit"
                        tabIndex="-1"
                    >
                        <div className="c-table-view-item__btn-inner">
                            <Icon name="edit" extraClasses="ez-icon--medium" />
                        </div>
                    </span>
                </td>
            </tr>
        );
    }
}

TableViewItemComponent.propTypes = {
    content: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemPriorityUpdate: PropTypes.func.isRequired,
    handleEditItem: PropTypes.func.isRequired,
    generateLink: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func.isRequired,
};
