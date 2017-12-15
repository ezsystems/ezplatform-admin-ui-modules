import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/load.more.component.css';

export default class LoadMoreComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalCount: props.totalCount,
            loadedCount: props.loadedCount,
            limit: props.limit
        };
    }

    componentWillReceiveProps({totalCount, loadedCount, limit}) {
        this.setState(state => Object.assign({}, state, {totalCount, loadedCount, limit}));
    }

    /**
     * Loads more items
     *
     * @method loadMore
     * @param {Event} event
     * @memberof LoadMoreComponent
     */
    loadMore(event) {
        if (this._refLoadMore.hasAttribute('disabled')) {
            return;
        }

        this.props.onLoadMore(event);
    }

    render() {
        const btnAttrs = {
            className: 'c-load-more__btn--load',
            onClick: this.loadMore.bind(this)
        };
        const {totalCount, loadedCount, limit} = this.state;

        if (!totalCount || loadedCount >= totalCount) {
            btnAttrs.disabled = true;
        }

        const loadMoreText = this.props.labels.info
            .replace('{{loaded}}', loadedCount)
            .replace('{{total}}', totalCount);
        const delta = totalCount - loadedCount;
        const loadMoreLimit = delta > limit ? limit : delta;
        const actionText = this.props.labels.action.replace('{{limit}}', loadMoreLimit);

        return (
            <div className="c-load-more">
                <div className="c-load-more__message" dangerouslySetInnerHTML={{__html: loadMoreText}}></div>
                <div {...btnAttrs} ref={ref => this._refLoadMore = ref}>{actionText}</div>
            </div>
        );
    }
}

LoadMoreComponent.propTypes = {
    totalCount: PropTypes.number.isRequired,
    loadedCount: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        info: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired
    })
};

LoadMoreComponent.defaultProps = {
    totalCount: 0,
    loadedCount: 0
};
