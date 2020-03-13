import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '../../../common/icon/icon';
import TranslationSelector from '../translation-selector/translation.selector';
import { createDraft } from '../..//services/universal.discovery.service';
import {
    RestInfoContext,
    EditOnTheFlyDataContext,
    AllowRedirectsContext,
    ActiveTabContext,
    ContentTypesMapContext,
} from '../..//universal.discovery.module';

const ContentEditButton = ({ version, location, isDisabled }) => {
    const restInfo = useContext(RestInfoContext);
    const allowRedirects = useContext(AllowRedirectsContext);
    const [editOnTheFlyData, setEditOnTheFlyData] = useContext(EditOnTheFlyDataContext);
    const [activeTab, setActiveTab] = useContext(ActiveTabContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const [isTranslationSelectorVisible, setIsTranslationSelectorVisible] = useState(false);

    useEffect(() => {
        setIsTranslationSelectorVisible(false);
    }, [version]);

    const hideTranslationSelector = () => {
        setIsTranslationSelectorVisible(false);
    };
    const toggleTranslationSelectorVisibility = () => {
        const languageCodes = version.VersionInfo.languageCodes.split(',');

        if (languageCodes.length === 1) {
            editContent(languageCodes[0]);
        } else {
            setIsTranslationSelectorVisible(true);
        }
    };
    const redirectToContentEdit = (contentId, versionNo, language, locationId) => {
        if (allowRedirects) {
            const contentTypeInfo = contentTypesMap[location.ContentInfo.Content.ContentType._href];
            const editRoute = window.eZ.adminUiConfig.userContentTypes.includes(contentTypeInfo.identifier)
                ? 'ezplatform.user.update'
                : 'ezplatform.content.draft.edit';

            window.location.href = window.Routing.generate(
                editRoute,
                {
                    contentId,
                    versionNo,
                    language,
                    locationId,
                },
                true
            );

            return;
        }

        setEditOnTheFlyData({
            contentId,
            versionNo,
            languageCode: language,
            locationId,
        });
        setActiveTab('content-edit');
    };
    const editContent = (languageCode) => {
        const contentId = location.ContentInfo.Content._id;

        createDraft(
            {
                ...restInfo,
                contentId,
            },
            (response) => redirectToContentEdit(contentId, response.Version.VersionInfo.versionNo, languageCode, location.id)
        );
    };
    const renderTranslationSelector = () => {
        return (
            <TranslationSelector
                hideTranslationSelector={hideTranslationSelector}
                selectTranslation={editContent}
                version={version}
                isOpen={isTranslationSelectorVisible && version}
            />
        );
    };

    return (
        <div className="c-content-edit-button">
            <button
                className="c-content-edit-button__btn btn btn-primary"
                disabled={!version || isDisabled}
                onClick={toggleTranslationSelectorVisibility}>
                <Icon name="edit" extraClasses="ez-icon--medium ez-icon--light" />
            </button>
            {renderTranslationSelector()}
        </div>
    );
};

ContentEditButton.propTypes = {
    location: PropTypes.object.isRequired,
    version: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool.isRequired,
};

export default ContentEditButton;
