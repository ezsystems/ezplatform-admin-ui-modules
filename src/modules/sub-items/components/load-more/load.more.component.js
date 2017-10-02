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

    handleClick(event) {
        if (this._refLoadMore.hasAttribute('disabled')) {
            return;
        }

        this.props.onLoadMore(event);
    }

    render() {
        const btnAttrs = {
            className: 'c-load-more__btn--load',
            onClick: this.handleClick.bind(this)
        };

        if (!this.state.totalCount || this.state.loadedCount >= this.state.totalCount) {
            btnAttrs.disabled = true;
        }

        return (
            <div className="c-load-more">
                <div className="c-load-more__message">Viewing <strong>{this.state.loadedCount}</strong> out of <strong>{this.state.totalCount}</strong> sub-items</div>
                <div {...btnAttrs} ref={ref => this._refLoadMore = ref}>Show {this.state.limit} more results</div>
            </div>
        );
    }
}

LoadMoreComponent.propTypes = {
    totalCount: PropTypes.number.isRequired,
    loadedCount: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    onLoadMore: PropTypes.func.isRequired
};

LoadMoreComponent.defaultProps = {
    totalCount: 0,
    loadedCount: 0,
    limit: 10
};