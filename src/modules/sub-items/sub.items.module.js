import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ViewSwitcherComponent from './components/view-switcher/view.switcher.component.js';
import SubItemsListComponent from './components/sub-items-list/sub.items.list.component.js';
import LoadMoreComponent from './components/load-more/load.more.component.js';

import { 
    updateLocationPriority,
    loadLocation, 
    loadContentInfo, 
    loadContentTypes 
} from './services/sub.items.service';

import './css/sub.items.module.css';

export default class SubItemsModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: props.activeView,
            items: props.items,
            contentTypesMap: {},
            total: 0,
            limit: 10,
            offset: 0,
            isLoading: !props.items.length
        };
    }

    componentDidMount() {
        if (this.state.items.length) {
            return;
        }

        this.loadItems();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.offset < this.state.offset) {
            this.loadItems();
        }
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {items: [...state.items, ...props.items]}));
    }

    handleLoadMore() {        
        this.setState(state => Object.assign({}, state, {offset: (state.offset + state.limit)}));
    }

    loadItems() {
        this.setState(state => Object.assign({}, state, {isLoading: true}));

        this.loadLocation(this.props.startingLocationId)
            .then(this.loadContentItems.bind(this, this.props.startingLocationId))
            .then(this.updateItemsState.bind(this, this.props.startingLocationId))
            .catch(error => console.log('sub:items:load:items:error', error));
    }

    loadLocation(id) {
        return new Promise((resolve) => this.props.loadLocation(id, this.state.limit, this.state.offset, resolve));
    }

    loadContentItems(locationId, response) {
        if (!response || !response.View) {
            throw new Error('Invalid response format');
        }

        const locations = response.View.Result.searchHits.searchHit;
        const promises = [];

        promises.push(new Promise((resolve) => {
            const contentIds = locations.map(item => item.value.Location.ContentInfo.Content._id);
            
            this.props.loadContentInfo(contentIds, resolve);
        }).then(contentInfo => ({
            locations,
            totalCount: response.View.Result.count,
            content: contentInfo.View.Result.searchHits.searchHit
        })));

        if (!Object.keys(this.state.contentTypesMap).length) {
            promises.push(new Promise((resolve) => this.props.loadContentTypes([5], resolve)));
        }

        return Promise.all(promises);
    }

    updateItemsState(locationId, data) {
        const {locations, content, totalCount} = data[0];
        const items = locations.reduce((total, location, index) => [...total, {
            location: location.value.Location,
            content: content[index].value.Content
        }], []);

        this.setState(state => {
            const newState = {
                items: [...state.items, ...items], 
                isLoading: false,
                totalCount
            };

            if (data[1] && data[1].ContentTypeInfoList) {
                newState.contentTypesMap = data[1].ContentTypeInfoList.ContentType.reduce((total, item) => {
                    total[item._href] = item;

                    return total;
                }, {});
            }

            return Object.assign({}, state, newState);
        });
    }

    handleItemPriorityUpdate(data) {
        this.props.updateLocationPriority(Object.assign({}, data, this.props.restInfo), this.afterPriorityUpdated.bind(this));
    }

    afterPriorityUpdated(response) {
        this.setState(this.updateItemsOrder.bind(this, response.Location));
    }

    updateItemsOrder(location, state) {
        const items = state.items;
        const item = items.find(element => element.location.id === location.id);

        item.location = location;

        items.sort((a, b) => a.location.priority - b.location.priority);

        return Object.assign({}, state, {items});
    }

    switchView(activeView) {
        this.setState(state => Object.assign({}, state, {activeView}));
    }

    renderExtraActions(action) {
        const Action = action.component;

        return <Action className="m-sub-items__action" {...action.attrs} />;
    }

    render() {  
        let listClassName = 'm-sub-items__list';

        if (this.state.isLoading) {
            listClassName = `${listClassName} ${listClassName}--loading`;
        }

        return (
            <div className="m-sub-items">
                <div className="m-sub-items__header">
                    <div className="m-sub-items__title">Sub-items ({this.state.items.length})</div>
                    <div className="m-sub-items__actions">
                        {this.props.extraActions.map(this.renderExtraActions)}
                    </div>
                    <ViewSwitcherComponent 
                        onViewChange={this.switchView.bind(this)} 
                        activeView={this.state.activeView} />
                </div>
                <div className={listClassName}>
                    <SubItemsListComponent 
                        activeView={this.state.activeView} 
                        contentTypesMap={this.state.contentTypesMap}
                        handleItemPriorityUpdate={this.handleItemPriorityUpdate.bind(this)}
                        items={this.state.items} />
                </div>
                <LoadMoreComponent 
                    totalCount={this.state.totalCount} 
                    loadedCount={this.state.items.length} 
                    limit={this.state.limit} 
                    onLoadMore={this.handleLoadMore.bind(this)} />
            </div>
        );
    }
}

SubItemsModule.propTypes = {
    startingLocationId: PropTypes.number.isRequired,
    activeView: PropTypes.string.isRequired,
    loadLocation: PropTypes.func.isRequired,
    loadContentInfo: PropTypes.func.isRequired,
    loadContentTypes: PropTypes.func.isRequired,
    updateLocationPriority: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired
    }).isRequired,
    extraActions: PropTypes.arrayOf(PropTypes.shape({
        component: PropTypes.element,
        attrs: PropTypes.object
    })),
};

SubItemsModule.defaultProps = {
    startingLocationId: 2,
    activeView: 'table',
    items: [],
    loadLocation,
    loadContentInfo,
    loadContentTypes,
    updateLocationPriority,
    extraActions: []
};