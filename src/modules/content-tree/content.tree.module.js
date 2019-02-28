import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentTree from './components/content-tree/content.tree';
import { loadLocationItems, loadSubtree } from './services/content.tree.service';

const KEY_CONTENT_TREE_SUBTREE = 'ez-content-tree-subtree';

export default class ContentTreeModule extends Component {
    constructor(props) {
        super(props);

        this.setInitialItemsState = this.setInitialItemsState.bind(this);
        this.loadMoreSubitems = this.loadMoreSubitems.bind(this);
        this.updateSubtreeAfterItemToggle = this.updateSubtreeAfterItemToggle.bind(this);

        const savedSubtree = localStorage.getItem(KEY_CONTENT_TREE_SUBTREE);

        this.items = props.preloadedLocations;
        this.subtree = savedSubtree ? JSON.parse(savedSubtree) : null;
    }

    componentDidMount() {
        if (this.items.length) {
            return;
        }

        if (this.subtree) {
            loadSubtree(this.props.restInfo, this.subtree, (loadedSubtree) => {
                this.setInitialItemsState(loadedSubtree[0]);
            });

            return;
        }

        loadLocationItems(this.props.restInfo, this.props.rootLocationId, this.setInitialItemsState);
    }

    setInitialItemsState(location) {
        this.items = [location];
        this.subtree = this.generateSubtree(this.items);

        this.forceUpdate();
    }

    loadMoreSubitems({ parentLocationId, offset, limit, path }, successCallback) {
        loadLocationItems(
            this.props.restInfo,
            parentLocationId,
            this.updateLocationsStateAfterLoadingMoreItems.bind(this, path, successCallback),
            limit,
            offset
        );
    }

    updateLocationsStateAfterLoadingMoreItems(path, successCallback, location) {
        const item = this.findItem(this.items, path.split(','));

        if (!item) {
            return;
        }

        item.subitems = [...item.subitems, ...location.subitems];

        this.updateSubtreeAfterLoadMoreItems(path);
        successCallback();
        this.forceUpdate();
    }

    updateSubtreeAfterLoadMoreItems(path) {
        const item = this.findItem(this.items, path.split(','));

        this.updateItemInSubtree(this.subtree[0], item, path.split(','));
        this.saveSubtree();
    }

    updateSubtreeAfterItemToggle(path, isExpanded) {
        const item = this.findItem(this.items, path.split(','));

        if (isExpanded) {
            this.addItemToSubtree(this.subtree[0], item, path.split(','));
        } else {
            this.removeItemFromSubtree(this.subtree[0], item, path.split(','));
        }

        this.saveSubtree();
    }

    addItemToSubtree(subtree, item, path) {
        const parentSubtree = this.findParentSubtree(subtree, path);

        if (!parentSubtree) {
            return;
        }

        const { subitemsLoadLimit } = this.props;

        parentSubtree.children.push({
            '_media-type': 'application/vnd.ez.api.ContentTreeLoadSubtreeRequestNode',
            locationId: item.locationId,
            limit: Math.ceil(item.subitems.length / subitemsLoadLimit) * subitemsLoadLimit,
            offset: 0,
            children: [],
        });
    }

    removeItemFromSubtree(subtree, item, path) {
        const parentSubtree = this.findParentSubtree(subtree, path);

        if (!parentSubtree) {
            return;
        }

        const index = parentSubtree.children.findIndex((element) => element.locationId === item.locationId);

        if (index > -1) {
            parentSubtree.children.splice(index, 1);
        }
    }

    updateItemInSubtree(subtree, item, path) {
        const parentSubtree = this.findParentSubtree(subtree, path);

        if (!parentSubtree) {
            return;
        }

        const index = parentSubtree.children.findIndex((element) => element.locationId === item.locationId);

        if (index > -1) {
            parentSubtree.children[index].limit = item.subitems.length;
        }
    }

    saveSubtree() {
        localStorage.setItem(KEY_CONTENT_TREE_SUBTREE, JSON.stringify(this.subtree));
    }

    findParentSubtree(subtree, path) {
        if (path.length < 2) {
            return;
        }

        path.shift();
        path.pop();

        return path.reduce(
            (subtree, locationId) => subtree.children.find((element) => element.locationId === parseInt(locationId, 10)),
            subtree
        );
    }

    generateSubtree(items) {
        const itemsWithoutLeafs = [];
        const { subitemsLoadLimit } = this.props;

        for (const item of items) {
            const isLeaf = !item.subitems.length;

            if (!isLeaf) {
                itemsWithoutLeafs.push({
                    '_media-type': 'application/vnd.ez.api.ContentTreeLoadSubtreeRequestNode',
                    locationId: item.locationId,
                    limit: Math.ceil(item.subitems.length / subitemsLoadLimit) * subitemsLoadLimit,
                    offset: 0,
                    children: this.generateSubtree(item.subitems),
                });
            }
        }

        return itemsWithoutLeafs;
    }

    findItem(items, path) {
        const isLast = path.length === 1;
        const item = items.find((element) => element.locationId === parseInt(path[0], 10));

        if (!item) {
            return null;
        }

        if (isLast) {
            return item;
        }

        if (!(item.hasOwnProperty('subitems') && Array.isArray(item.subitems))) {
            return null;
        }

        path.shift();

        return this.findItem(item.subitems, path);
    }

    render() {
        const { currentLocationId, subitemsLoadLimit } = this.props;
        const attrs = {
            items: this.items,
            currentLocationId,
            subitemsLoadLimit,
            loadMoreSubitems: this.loadMoreSubitems,
            afterItemToggle: this.updateSubtreeAfterItemToggle,
        };

        return <ContentTree {...attrs} />;
    }
}

eZ.addConfig('modules.ContentTree', ContentTreeModule);

ContentTreeModule.propTypes = {
    rootLocationId: PropTypes.number.isRequired,
    currentLocationId: PropTypes.number.isRequired,
    preloadedLocations: PropTypes.arrayOf(PropTypes.object),
    subitemsLoadLimit: PropTypes.number,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
};

ContentTreeModule.defaultProps = {
    rootLocationId: 2,
    preloadedLocations: [],
    subitemsLoadLimit: 10,
};
