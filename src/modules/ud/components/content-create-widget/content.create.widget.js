import React, { useContext, useState } from 'react';

import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import {
    CreateContentWidgetContext,
    ActiveTabContext,
    ContentOnTheFlyDataContext,
    MarkedLocationContext,
} from '../../universal.discovery.module';

// @TODO
const languages = Object.values(window.eZ.adminUiConfig.languages.mappings);

const ContentCreateWidget = () => {
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0].languageCode);
    const [selectedContentType, setSelectedContentType] = useState('');
    const [activeTab, setActiveTab] = useContext(ActiveTabContext);
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const [contentOnTheFlyData, setContentOnTheFlyData] = useContext(ContentOnTheFlyDataContext);
    const close = () => {
        setCreateContentVisible(false);
    };
    const updateFilterQuery = (event) => {
        const query = event.target.value.toLowerCase();

        setFilterQuery(query);
    };
    const updateSelectedLanguage = (event) => setSelectedLanguage(event.target.value);
    const isConfirmDisabled = !selectedContentType || !selectedLanguage || markedLocation === 1;
    const createContent = () => {
        setContentOnTheFlyData({
            locationId: markedLocation,
            languageCode: selectedLanguage,
            contentTypeIdentifier: selectedContentType,
        });
        setActiveTab('content-create');
    };

    return (
        <div className="c-content-create">
            <div className="c-content-create__header">
                <div className="c-content-create__header-title">Create new content</div>
                <button type="button" className="c-content-create__close-button" onClick={close}>
                    <Icon name="discard" extraClasses="ez-icon--small-medium" />
                </button>
            </div>
            <div className="c-content-create__language-selector-wrapper">
                <div className="c-content-create__language-selector-label">Select a language</div>
                <select className="form-control" onChange={updateSelectedLanguage}>
                    {languages.map((language) => {
                        return (
                            <option key={language.id} value={language.languageCode} onChange={updateSelectedLanguage}>
                                {language.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="c-content-create__select-content-type-wrapper">
                <div className="c-content-create__select-content-type-label">Select a Content Type</div>
                <input className="form-control" type="text" placeholder="Type to refine" onChange={updateFilterQuery} />
                <div className="c-content-create__content-type-list">
                    {Object.entries(window.eZ.adminUiConfig.contentTypes).map(([groupName, groupItems]) => {
                        const isHidden =
                            filterQuery && groupItems.every((groupItem) => !groupItem.name.toLowerCase().includes(filterQuery));

                        return (
                            <div className="c-content-create__group" key={groupName}>
                                <div className="c-content-create__group-name" hidden={isHidden}>
                                    {groupName}
                                </div>
                                {groupItems.map(({ name, thumbnail, identifier }) => {
                                    const isHidden = filterQuery && !name.toLowerCase().includes(filterQuery);
                                    const className = createCssClassNames({
                                        'c-content-create__group-item': true,
                                        'c-content-create__group-item--selected': identifier === selectedContentType,
                                    });
                                    const updateSelectedContentType = () => setSelectedContentType(identifier);

                                    return (
                                        <div hidden={isHidden} key={identifier} className={className} onClick={updateSelectedContentType}>
                                            <div className="c-content-create__group-item-icon">
                                                <Icon customPath={thumbnail} extraClasses="ez-icon--small" />
                                            </div>
                                            <div className="c-content-create__group-item-name">{name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="c-content-create__confirm-wrapper">
                <button className="c-content-create__confirm-button btn btn-primary" onClick={createContent} disabled={isConfirmDisabled}>
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default ContentCreateWidget;
