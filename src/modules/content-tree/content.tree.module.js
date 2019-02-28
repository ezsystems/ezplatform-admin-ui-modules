import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentTree from './components/content-tree/content.tree';
import { loadLocationItems } from './services/content.tree.service';

export default class ContentTreeModule extends Component {
    constructor(props) {
        super(props);

        this.setInitialItemsState = this.setInitialItemsState.bind(this);
        this.loadMoreSubitems = this.loadMoreSubitems.bind(this);
        this.handleLocationVisibilityChange = this.handleLocationVisibilityChange.bind(this);

        this.items = props.preloadedLocations;
        this.currentLocationItem = null;
    }

    componentDidMount() {
        if (this.items.length) {
            return;
        }

        loadLocationItems(this.props.rootLocationId, this.setInitialItemsState);

        document.body.addEventListener('ezLocationVisibilityChanged', this.handleLocationVisibilityChange, false);
    }

    setInitialItemsState(location) {
        this.items = [location];

        this.forceUpdate();
    }

    loadMoreSubitems({ parentLocationId, offset, limit, path }, successCallback) {
        loadLocationItems(
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

        successCallback();
        this.forceUpdate();
    }

    handleLocationVisibilityChange(event) {
        const { locationId, isInvisible } = event.detail;
        const locationItem = this.findItemBfs(this.items[0], locationId);

        if (!locationItem) {
            return;
        }

        locationItem.isInvisible = isInvisible;
        this.forceUpdate();
    }

    findItemBfs(rootItem, locationId) {
        const queue = [];

        queue.unshift(rootItem);

        while (queue.length > 0) {
            const currentItem = queue.pop();

            if (currentItem.locationId === locationId) {
                return currentItem;
            }

            currentItem.subitems.forEach((item) => {
                queue.unshift(item);
            });
        }

        return null;
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
};

ContentTreeModule.defaultProps = {
    rootLocationId: 2,
    preloadedLocations: [],
    subitemsLoadLimit: 10,
};
