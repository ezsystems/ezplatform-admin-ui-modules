import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeBranchComponent from './finder.tree.branch.component.js';

import './css/finder.component.css';
import mainLocationData from './data/main.location.json';
import homeLocationData from './data/home.location.json';
import usersLocationData from './data/users.location.json';
import mediaLocationData from './data/media.location.json';
import blogLocationData from './data/blog.location.json';

export default class FinderComponent extends Component {
    constructor() {
        super();

        this.state = {
            contentMap: {
                1: mainLocationData,
                2: homeLocationData,
                5: usersLocationData,
                43: mediaLocationData,
                66: blogLocationData
            },
            locations: {
                0: {parent: 0, data: mainLocationData}
            }
        }
    }

    componentDidUpdate() {
        this.updateBranchesContainerScroll();
    }

    updateBranchesContainerScroll() {
        this._refBranches.scrollLeft = this._refBranches.scrollWidth - this._refBranches.clientWidth;
    }

    renderBranch({parent, data}) {
        if (!data.View) {
            return;
        }

        const items = data.View.Result.searchHits.searchHit;
        const locations = Object.values(this.state.locations);
        const selectedLocations = locations.map(item => item.parent);

        return <FinderTreeBranchComponent 
            ref={ref => this._lastBranch = ref}
            key={parent} 
            parent={parent} 
            items={items} 
            selectedLocations={selectedLocations}
            onItemClick={this.handleItemClick.bind(this)} />
    }

    handleItemClick({parent, location}) {
        this.updateSelectedBranches(parent, location);
        this.props.onItemSelect(location);
    }

    updateSelectedBranches(parent, location) {
        this.setState(this.updateLocations.bind(this, parent, location));
    }

    updateLocations(parent, location, state) {
        const data = state.contentMap[location.id] || {};
        const locationDepth = parseInt(location.depth, 10);
        const locations = Object
            .keys(state.locations)
            .filter(key => parseInt(key, 10) < locationDepth)
            .reduce((total, depth) => {
                depth = parseInt(depth, 10);

                total[depth] = state.locations[depth];

                return total;
            }, {});

        locations[locationDepth] = {parent, data};

        return Object.assign({}, state, {locations});
    }

    render() {
        return (
            <div className="finder-component">
                <div className="finder-component__branches" ref={(ref) => this._refBranches = ref}>
                    {Object.values(this.state.locations).map(this.renderBranch.bind(this))}
                </div>
            </div>
        );
    }
}

FinderComponent.propTypes = {
    canSelectContent: PropTypes.func,
    multiple: PropTypes.bool,
    startingLocationId: PropTypes.string,
    minDiscoverDepth: PropTypes.number,
    shouldLoadContent: PropTypes.bool,
    onItemSelect: PropTypes.func.isRequired
};
