import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './components/list/list.component';

const CLASS_IS_TREE_RESIZING = 'ez-is-tree-resizing';

export default class ContentTreeModule extends Component {
    constructor(props) {
        super(props);

        this.changeContainerWidth = this.changeContainerWidth.bind(this);
        this.addWidthChangeListener = this.addWidthChangeListener.bind(this);
        this.removeWidthChangeListener = this.removeWidthChangeListener.bind(this);
        this._refTreeContainer = React.createRef();

        this.state = {
            selectedLocationId: props.selectedLocationId,
            locations: props.preloadedLocations,
            resizeStartPositionX: 0,
            containerWidth: 0,
            resizedContainerWidth: 0,
            isResizing: false,
        };
    }

    componentWillUnmount() {
        this.clearDocumentResizingState();
    }

    changeContainerWidth({ clientX }) {
        const currentPositionX = clientX;

        this.setState((state) => ({
            resizedContainerWidth: state.containerWidth + (currentPositionX - state.resizeStartPositionX),
        }));
    }

    addWidthChangeListener({ nativeEvent }) {
        const resizeStartPositionX = nativeEvent.clientX;
        const containerWidth = parseInt(window.getComputedStyle(this._refTreeContainer.current).width, 10);

        window.document.addEventListener('mousemove', this.changeContainerWidth, false);
        window.document.addEventListener('mouseup', this.removeWidthChangeListener, false);
        window.document.body.classList.add(CLASS_IS_TREE_RESIZING);

        this.setState(() => ({ resizeStartPositionX, containerWidth, isResizing: true }));
    }

    removeWidthChangeListener() {
        this.clearDocumentResizingState();

        this.setState((state) => ({
            resizeStartPositionX: 0,
            containerWidth: state.resizedContainerWidth,
            isResizing: false,
        }));
    }

    clearDocumentResizingState() {
        window.document.removeEventListener('mousemove', this.changeContainerWidth);
        window.document.removeEventListener('mouseup', this.removeWidthChangeListener);
        window.document.body.classList.remove(CLASS_IS_TREE_RESIZING);
    }

    render() {
        const { isResizing, containerWidth, resizedContainerWidth, selectedLocationId } = this.state;
        const width = isResizing ? resizedContainerWidth : containerWidth;
        const containerAttrs = { className: 'm-tree', ref: this._refTreeContainer };

        if (width) {
            containerAttrs.style = { width: `${width}px` };
        }

        return (
            <div {...containerAttrs}>
                <List items={this.state.locations} selectedLocationId={selectedLocationId} />
                <div className="m-tree__resize-handler" onMouseDown={this.addWidthChangeListener} />
            </div>
        );
    }
}

ContentTreeModule.propTypes = {
    selectedLocationId: PropTypes.number,
    preloadedLocations: PropTypes.arrayOf(PropTypes.object),
};

ContentTreeModule.defaultProps = {
    preloadedLocations: [],
};
