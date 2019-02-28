import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '../list/list.component';

const CLASS_IS_TREE_RESIZING = 'ez-is-tree-resizing';

export default class ContentTree extends Component {
    constructor(props) {
        super(props);

        this.changeContainerWidth = this.changeContainerWidth.bind(this);
        this.addWidthChangeListener = this.addWidthChangeListener.bind(this);
        this.handleResizeEnd = this.handleResizeEnd.bind(this);
        this._refTreeContainer = React.createRef();

        this.state = {
            resizeStartPositionX: 0,
            containerWidth: 0,
            resizedContainerWidth: 0,
            isResizing: false,
        };
    }

    componentWillUnmount() {
        this.clearDocumentResizingListeners();
    }

    changeContainerWidth({ clientX }) {
        const currentPositionX = clientX;

        this.setState((state) => ({
            resizedContainerWidth: state.containerWidth + (currentPositionX - state.resizeStartPositionX),
        }));
    }

    addWidthChangeListener({ nativeEvent }) {
        const resizeStartPositionX = nativeEvent.clientX;
        const containerWidth = this._refTreeContainer.current.getBoundingClientRect().width;

        window.document.addEventListener('mousemove', this.changeContainerWidth, false);
        window.document.addEventListener('mouseup', this.handleResizeEnd, false);
        window.document.body.classList.add(CLASS_IS_TREE_RESIZING);

        this.setState(() => ({ resizeStartPositionX, containerWidth, isResizing: true }));
    }

    handleResizeEnd() {
        this.clearDocumentResizingListeners();

        this.setState((state) => ({
            resizeStartPositionX: 0,
            containerWidth: state.resizedContainerWidth,
            isResizing: false,
        }));
    }

    clearDocumentResizingListeners() {
        window.document.removeEventListener('mousemove', this.changeContainerWidth);
        window.document.removeEventListener('mouseup', this.handleResizeEnd);
        window.document.body.classList.remove(CLASS_IS_TREE_RESIZING);
    }

    render() {
        const { isResizing, containerWidth, resizedContainerWidth } = this.state;
        const { items, loadMoreSubitems, currentLocationId, subitemsLoadLimit, afterItemToggle } = this.props;
        const width = isResizing ? resizedContainerWidth : containerWidth;
        const rootLocationSubitems = items.length ? items[0].subitems : [];
        const rootLocationPath = items.length ? '' + items[0].locationId : '';
        const containerAttrs = { className: 'm-tree', ref: this._refTreeContainer };
        const listAttrs = {
            items: rootLocationSubitems,
            path: rootLocationPath,
            loadMoreSubitems,
            currentLocationId,
            subitemsLoadLimit,
            afterItemToggle,
        };

        if (width) {
            containerAttrs.style = { width: `${width}px` };
        }

        return (
            <div {...containerAttrs}>
                <List {...listAttrs} />
                <div className="m-tree__resize-handler" onMouseDown={this.addWidthChangeListener} />
            </div>
        );
    }
}

ContentTree.propTypes = {
    items: PropTypes.array.isRequired,
    loadMoreSubitems: PropTypes.func.isRequired,
    currentLocationId: PropTypes.number.isRequired,
    subitemsLoadLimit: PropTypes.number,
    afterItemToggle: PropTypes.func.isRequired,
};
