import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentTree from './components/content-tree/content.tree';
import { loadLocationItems } from './services/content.tree.service';
import deepClone from '../common/helpers/deep.clone.helper';

const findItem = (items, path) => {
    const isLast = path.length === 1;
    const item = items.find((element) => element.locationId === parseInt(path[0], 10));

    if (!item) {
        return null;
    }

    if (isLast) {
        return item;
    }

    path.shift();

    if (item.hasOwnProperty('subitems') && Array.isArray(item.subitems)) {
        let result = null;
        let subitem = null;
        let subitemPath = [...path];

        for (let i = 0; result === null && i < item.subitems.length; i++) {
            subitem = item.subitems[i];

            if (subitem.locationId === parseInt(subitemPath[0], 10)) {
                result = subitem;
            } else {
                result = findItem(subitem.subitems, subitemPath);
            }
        }

        return result;
    }
};

export default class ContentTreeModule extends Component {
    constructor(props) {
        super(props);

        this.setInitialItemsState = this.setInitialItemsState.bind(this);
        this.loadMoreSubitems = this.loadMoreSubitems.bind(this);
        this.items = props.preloadedLocations;
    }

    componentDidMount() {
        if (this.items.length) {
            return;
        }

        loadLocationItems(this.props.rootLocationId, this.setInitialItemsState);
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
        const item = findItem(this.items, path.split(','));

        if (!item) {
            return;
        }

        item.subitems = [...item.subitems, ...location.subitems];

        successCallback();
        this.forceUpdate();
    }

    render() {
        const attrs = {
            items: this.items,
            currentLocationId: this.props.currentLocationId,
            loadMoreSubitems: this.loadMoreSubitems,
        };

        console.log('render', attrs);

        return <ContentTree {...attrs} />;
    }
}

eZ.addConfig('modules.ContentTree', ContentTreeModule);

ContentTreeModule.propTypes = {
    rootLocationId: PropTypes.number.isRequired,
    currentLocationId: PropTypes.number.isRequired,
    preloadedLocations: PropTypes.arrayOf(PropTypes.object),
};

ContentTreeModule.defaultProps = {
    rootLocationId: 2,
    preloadedLocations: [],
};
