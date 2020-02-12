import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const { formatShortDateTime } = window.eZ.helpers.timezone;
const SELECT_LANGUAGES_MENU_VISIBLE_CLASS = 'c-table-view-item__ez-extra-actions--visible';

export default class TableViewItemComponent extends PureComponent {
    constructor(props) {
        super(props);

        this.storePriorityValue = this.storePriorityValue.bind(this);
        this.enablePriorityInput = this.enablePriorityInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSelectLanguage = this.handleSelectLanguage.bind(this);
        this.onSelectCheckboxChange = this.onSelectCheckboxChange.bind(this);
        this.setPriorityInputRef = this.setPriorityInputRef.bind(this);

        this._refPriorityInput = null;
        this._refSelectedLanguageMenu = React.createRef();

        this.state = {
            priorityValue: props.item.priority,
            priorityInputEnabled: false,
            startingPriorityValue: props.item.priority,
            selectedLanguageCode: undefined,
        };

        this.columnsRenderers = {
            name: this.renderNameCell.bind(this),
            modified: this.renderModifiedCell.bind(this),
            'content-type': this.renderContentTypeCell.bind(this),
            priority: this.renderPriorityCell.bind(this),
            translations: this.renderTranslationsCell.bind(this),
            visibility: this.renderVisibilityCell.bind(this),
            creator: this.renderCreatorCell.bind(this),
            contributor: this.renderContributorCell.bind(this),
            published: this.renderPublishedCell.bind(this),
            section: this.renderSectionCell.bind(this),
            'location-id': this.renderLocationIdCell.bind(this),
            'location-remote-id': this.renderLocationRemoteIdCell.bind(this),
            'object-id': this.renderObjectIdCell.bind(this),
            'object-remote-id': this.renderObjectRemoteIdCell.bind(this),
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
            pathString: this.props.item.pathString,
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
     * Select language for subitems edit
     *
     * @method handleSelectLanguage
     * @param {Event} event
     * @memberof TableViewItemComponent
     */
    handleSelectLanguage(event) {
        event.preventDefault();
        const { languageCode } = event.target.dataset;
        console.log('handel select : ');
        this.setState(() => ({ selectedLanguageCode: languageCode }), this.handleEdit);
    }

    /**
     * Handles edit action.
     *
     * @method handleEdit
     * @memberof TableViewItemComponent
     */
    handleEdit() {
        const { id, mainLanguageCode, currentVersion } = this.props.item.content._info;
        const { languageCodes } = currentVersion;

        if (languageCodes.length > 1 && this.state.selectedLanguageCode === undefined) {
            this._refSelectedLanguageMenu.current.classList.toggle(SELECT_LANGUAGES_MENU_VISIBLE_CLASS);
            return;
        }

        console.log('Send for ', this.state.selectedLanguageCode || mainLanguageCode);
        return false;
        this.props.handleEditItem({
            _id: id,
            mainLanguageCode,
            CurrentVersion: {
                Version: {
                    VersionInfo: {
                        versionNo: currentVersion.versionNumber,
                    },
                },
            },
        }, this.props.item.id);
    }

    setPriorityInputRef(ref) {
        this._refPriorityInput = ref;
    }

    renderNameCell() {
        const { item, generateLink } = this.props;
        const contentName = item.content._name;
        const linkAttrs = {
            className: 'c-table-view-item__link c-table-view-item__text-wrapper',
            title: contentName,
            href: generateLink(item.id),
        };

        return <a {...linkAttrs}>{contentName}</a>;
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
            inputAttrs.readOnly = true;
            delete inputAttrs.defaultValue;
            inputAttrs.value = this.state.priorityValue;
            priorityWrapperAttrs.onClick = this.enablePriorityInput;
            innerWrapperAttrs.hidden = true;
        }

        return (
            <div className="c-table-view-item__priority-wrapper" {...priorityWrapperAttrs}>
                <div className="c-table-view-item__inner-wrapper c-table-view-item__inner-wrapper--input">
                    <input className="c-table-view-item__priority-value" ref={this.setPriorityInputRef} {...inputAttrs} />
                </div>
                <div className="c-table-view-item__priority-actions" {...innerWrapperAttrs}>
                    <button type="button" className="c-table-view-item__btn c-table-view-item__btn--cancel" onClick={this.handleCancel}>
                        <Icon name="discard" extraClasses="ez-icon--medium ez-icon--light" />
                    </button>
                    <button type="button" className="c-table-view-item__btn c-table-view-item__btn--submit" onClick={this.handleSubmit}>
                        <Icon name="checkmark" extraClasses="ez-icon--medium ez-icon--light" />
                    </button>
                </div>
            </div>
        );
    }

    renderModifiedCell() {
        const { modificationDate } = this.props.item.content._info;

        return <div className="c-table-view-item__text-wrapper">{formatShortDateTime(new Date(modificationDate.timestamp * 1000))}</div>;
    }

    renderPublishedCell() {
        const { publishedDate } = this.props.item.content._info;

        return <div className="c-table-view-item__text-wrapper">{formatShortDateTime(new Date(publishedDate.timestamp * 1000))}</div>;
    }

    renderContentTypeCell() {
        const contentTypeName = this.props.item.content._info.contentType.name;

        return <div className="c-table-view-item__text-wrapper">{contentTypeName}</div>;
    }

    renderTranslationsCell() {
        const { item, languages } = this.props;

        return (
            <Fragment>
                {item.content._info.currentVersion.languageCodes.map((languageCode) => (
                    <span key={languageCode} className="c-table-view-item__translation">
                        {languages.mappings[languageCode].name}
                    </span>
                ))}
            </Fragment>
        );
    }

    renderVisibilityCell() {
        const { invisible, hidden } = this.props.item;
        const visibleLabel = Translator.trans(/*@Desc("Visible")*/ 'items_table.row.visible.label', {}, 'sub_items');
        const notVisibleLabel = Translator.trans(/*@Desc("Not Visible")*/ 'items_table.row.not_visible.label', {}, 'sub_items');
        const label = !invisible && !hidden ? visibleLabel : notVisibleLabel;

        return <div className="c-table-view-item__text-wrapper">{label}</div>;
    }

    renderCreatorCell() {
        return <div className="c-table-view-item__text-wrapper">{this.props.item.content._info.owner.name}</div>;
    }

    renderContributorCell() {
        return <div className="c-table-view-item__text-wrapper">{this.props.item.content._info.currentVersion.creator.name}</div>;
    }

    renderSectionCell() {
        const section = this.props.item.content._info.section;
        const sectionName = section ? section.name : '';

        return <div className="c-table-view-item__text-wrapper">{sectionName}</div>;
    }

    renderLocationIdCell() {
        return <div className="c-table-view-item__text-wrapper">{this.props.item.id}</div>;
    }

    renderLocationRemoteIdCell() {
        return <div className="c-table-view-item__text-wrapper">{this.props.item.remoteId}</div>;
    }

    renderObjectIdCell() {
        return <div className="c-table-view-item__text-wrapper">{this.props.item.content._info.id}</div>;
    }

    renderObjectRemoteIdCell() {
        return <div className="c-table-view-item__text-wrapper">{this.props.item.content._info.remoteId}</div>;
    }

    renderBasicColumns() {
        const { columnsVisibility } = this.props;
        const columnsToRender = {
            name: true,
            ...columnsVisibility,
        };

        return Object.entries(columnsToRender).map(([columnKey, isVisible]) => {
            if (!isVisible) {
                return null;
            }

            return (
                <td key={columnKey} className={`c-table-view-item__cell c-table-view-item__cell--${columnKey}`}>
                    {this.columnsRenderers[columnKey]()}
                </td>
            );
        });
    }

    /**
     * Calls onItemSelect callback for given item
     *
     * @param {Event} event
     */
    onSelectCheckboxChange(event) {
        const { item, onItemSelect } = this.props;
        const isSelected = event.target.checked;

        onItemSelect(item, isSelected);
    }

    /**
     * Render choosing language to edit subitems
     *
     */
    renderContentEditLanguage() {
        const languages = this.props.languages.mappings;
        const { languageCodes } = this.props.item.content._info.currentVersion;

        if (languageCodes.length > 1) {
            return (
                <div
                    className="ez-extra-actions ez-extra-actions--edit c-table-view-item__ez-extra-actions"
                    dataActions="edit"
                    ref={this._refSelectedLanguageMenu}>
                    <div className="ez-extra-actions__header">Label</div>
                    <div className="ez-extra-actions__content">
                        <form name="content_edit" method="post" action="/admin/content/edit">
                            <div className="ez-extra-actions__form-values">
                                {languageCodes.map((languageCode) => {
                                    return (
                                        <div className="form-check">
                                            <button
                                                className="form-check-label"
                                                onClick={this.handleSelectLanguage}
                                                data-language-code={languageCode}>
                                                {languages[languageCode].name}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </form>
                    </div>
                </div>
            );
        } else {
            return false;
        }
    }

    render() {
        const { item, isSelected } = this.props;
        const editLabel = Translator.trans(/*@Desc("Edit")*/ 'edit_item_btn.label', {}, 'sub_items');
        const contentTypeIdentifier = item.content._info.contentType.identifier;
        const contentTypeIconUrl = eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier);

        return (
            <tr className="c-table-view-item">
                <td className="c-table-view-item__cell c-table-view-item__cell--checkbox">
                    <input type="checkbox" checked={isSelected} onChange={this.onSelectCheckboxChange} />
                </td>
                <td className="c-table-view-item__cell c-table-view-item__cell--icon">
                    <Icon customPath={contentTypeIconUrl} extraClasses="ez-icon--small" />
                </td>
                {this.renderBasicColumns()}
                <td className="c-table-view-item__cell c-table-view-item__cell--actions">
                    <span
                        title={editLabel}
                        onClick={this.handleEdit}
                        className="c-table-view-item__btn c-table-view-item__btn--edit"
                        tabIndex={-1}>
                        <div className="c-table-view-item__btn-inner">
                            <Icon name="edit" extraClasses="ez-icon--medium" />
                        </div>
                    </span>
                    {this.renderContentEditLanguage()}
                </td>
            </tr>
        );
    }
}

TableViewItemComponent.propTypes = {
    item: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onItemPriorityUpdate: PropTypes.func.isRequired,
    handleEditItem: PropTypes.func.isRequired,
    generateLink: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    columnsVisibility: PropTypes.object.isRequired,
};
