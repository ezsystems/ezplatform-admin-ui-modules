import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/finder.tree.leaf.component.css';

export default class FinderTreeLeafComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: props.selected,
            isLoadingChildren: props.isLoadingChildren
        };
    }

    componentWillReceiveProps({selected, isLoadingChildren}) {
        this.setState(state => Object.assign({}, state, {
            selected,
            isLoadingChildren
        }));
    }

    /**
     * Handles clicks on a leaf
     *
     * @method handleClick
     * @memberof FinderTreeLeafComponent
     */
    handleClick() {
        const {location} = this.props;

        this.setState(
            (state) => Object.assign({}, state, {
                selected: true,
                isLoadingChildren: !!location.childCount
            }),
            () => this.props.onClick(location)
        );
    }

    /**
     * Renders a loading state icon
     *
     * @method renderLoadingIcon
     * @returns {Element}
     * @memberof FinderTreeLeafComponent
     */
    renderLoadingIcon() {
        if (!this.state.selected || !this.state.isLoadingChildren) {
            return null;
        }

        return (
            <svg className="ez-icon ez-spin ez-icon-x2 ez-icon-spinner">
                <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner"></use>
            </svg>
        );
    }

    render() {
        const location = this.props.location;
        const componentClassName = 'c-finder-tree-leaf';
        const isSelected = this.state.selected ? `${componentClassName}--selected` : '';
        const hasChildren = location.childCount ? `${componentClassName}--has-children` : '';
        const isLoadingChildren = this.state.isLoadingChildren ? `${componentClassName}--loading` : '';
        const finalClassName = `${componentClassName} ${isSelected} ${hasChildren} ${isLoadingChildren}`;

        return (
            <div className={finalClassName} onClick={this.handleClick.bind(this)}>
                {location.ContentInfo.Content.Name}
                {this.renderLoadingIcon()}
            </div>
        );
    }
}

FinderTreeLeafComponent.propTypes = {
    location: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    isLoadingChildren: PropTypes.bool.isLoadingChildren
};
