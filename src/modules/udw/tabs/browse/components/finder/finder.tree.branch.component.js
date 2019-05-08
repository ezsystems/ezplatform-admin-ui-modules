import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ContentTypesContext } from '../../../../udw.module';
import FinderTreeLeafComponent from './finder.tree.leaf.component';
import { classnames } from '../../../../../common/classnames/classnames';

const TEXT_LOAD_MORE = Translator.trans(/*@Desc("Load more")*/ 'finder.branch.load_more.label', {}, 'universal_discovery_widget');

const FinderTreeBranchComponent = (props) => {
    const { activeLocationId, isActiveLocationLoading, allowContainersOnly, allowedLocations } = props;
    const { multiple, selectedContent, checkCanSelectContent, parentLocation, items, total } = props;
    const { onItemSelect, onLoadMore, onItemDeselect, onBranchClick, onItemClick } = props;
    const contentTypesMap = useContext(ContentTypesContext);
    const expandBranch = useCallback(() => onBranchClick(parentLocation), [onBranchClick, parentLocation]);
    const handleLoadMore = useCallback(() => onLoadMore(parentLocation), [onLoadMore, parentLocation]);
    const renderLeaf = (data) => {
        const location = data.value.Location;
        const contentTypeHref = location.ContentInfo.Content.ContentType._href;
        const isContainer = contentTypesMap && contentTypesMap[contentTypeHref] && contentTypesMap[contentTypeHref].isContainer;
        const isSelectable = !(allowContainersOnly && !isContainer);
        const active = location.id === activeLocationId;
        const isLoadingChildren = active && isActiveLocationLoading;

        return (
            <FinderTreeLeafComponent
                key={location.remoteId}
                location={location}
                onClick={onItemClick}
                isMarked={active}
                isLoadingChildren={isLoadingChildren}
                isSelectable={isSelectable}
                allowedLocations={allowedLocations}
                multiple={multiple}
                isSelected={!!selectedContent.find((content) => content.id === location.id)}
                onItemSelect={onItemSelect}
                checkCanSelectContent={checkCanSelectContent}
                onItemDeselect={onItemDeselect}
            />
        );
    };
    const renderLoadMore = () => {
        if (!items.length || items.length === total) {
            return null;
        }

        return (
            <button type="button" className="c-finder-tree-branch__load-more" onClick={handleLoadMore}>
                {TEXT_LOAD_MORE}
            </button>
        );
    };

    const wrapperAttrs = {
        className: classnames({
            'c-finder-tree-branch': true,
            'c-finder-tree-branch--collapsed': !items.length,
        }),
        onClick: !items.length ? expandBranch : undefined,
    };

    return (
        <div {...wrapperAttrs}>
            <div className="c-finder-tree-branch__list-wrapper">
                {items.map(renderLeaf)}
                {renderLoadMore()}
            </div>
        </div>
    );
};

FinderTreeBranchComponent.propTypes = {
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    parentLocation: PropTypes.object,
    onItemClick: PropTypes.func.isRequired,
    onBranchClick: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    allowContainersOnly: PropTypes.bool,
    contentTypesMap: PropTypes.object,
    allowedLocations: PropTypes.array.isRequired,
    multiple: PropTypes.bool.isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    checkCanSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    activeLocationId: PropTypes.string,
    isActiveLocationLoading: PropTypes.bool,
    onItemSelect: PropTypes.func.isRequired,
    onItemDeselect: PropTypes.func.isRequired,
};

export default FinderTreeBranchComponent;
