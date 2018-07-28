import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/load.more.component.css';

export default class LoadMoreComponent extends Component {
    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);

        this.state = {
            totalCount: props.totalCount,
            loadedCount: props.loadedCount,
            limit: props.limit,
        };
    }

    UNSAFE_componentWillReceiveProps({ totalCount, loadedCount, limit }) {
        this.setState((state) => ({ totalCount, loadedCount, limit }));
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
            onClick: this.loadMore,
        };
        const { totalCount, loadedCount, limit } = this.state;

        if (!totalCount || loadedCount >= totalCount) {
            btnAttrs.disabled = true;
        }

        const loadMoreText = Translator.trans(
            /*@Desc("Viewing <strong>%loaded%</strong> out of <strong>%total%</strong> sub-items")*/ 'load_more.info.text',
            {
                loaded: loadedCount,
                total: totalCount,
            },
            'sub_items'
        );
        const delta = totalCount - loadedCount;
        const loadMoreLimit = delta > limit ? limit : delta;
        const actionText = Translator.trans(
            /*@Desc("Show %limit% more results")*/ 'load_more.action.text',
            {
                limit: loadMoreLimit,
            },
            'sub_items'
        );

        return (
            <div className="c-load-more">
                <div className="c-load-more__message" dangerouslySetInnerHTML={{ __html: loadMoreText }} />
                <div {...btnAttrs} ref={(ref) => (this._refLoadMore = ref)}>
                    {actionText}
                </div>
            </div>
        );
    }
}

LoadMoreComponent.propTypes = {
    totalCount: PropTypes.number.isRequired,
    loadedCount: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    onLoadMore: PropTypes.func.isRequired,
};

LoadMoreComponent.defaultProps = {
    totalCount: 0,
    loadedCount: 0,
};
