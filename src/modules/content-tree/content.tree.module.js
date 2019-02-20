import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentTree from './components/content-tree/content.tree';
import { loadLocationItems } from './services/content.tree.service';
import deepClone from '../common/helpers/deep.clone.helper';

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
        console.log('updateLocationsStateAfterLoadingMoreItems', { location, path });

        successCallback();
    }

    render() {
        const attrs = {
            items: this.items,
            currentLocationId: this.props.currentLocationId,
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
};

ContentTreeModule.defaultProps = {
    rootLocationId: 2,
    preloadedLocations: [],
};
