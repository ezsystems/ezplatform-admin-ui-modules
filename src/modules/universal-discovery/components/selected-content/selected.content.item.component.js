import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/selected.content.item.component.css';

export default class SelectedContentItemComponent extends Component {
    remove() {
        this.props.onRemove(this.props.data.id);
    }

    render() {
        const {data} = this.props;

        return (
            <div className="selected-content-item-component">
                <div className="selected-content-item-component__remove" onClick={this.remove.bind(this)}>X</div>
                <div className="selected-content-item-component__wrapper">
                    <div className="selected-content-item-component__name">{data.ContentInfo.Content.Name}</div>
                    <div className="selected-content-item-component__type">{data.ContentInfo.Content.ContentType._href}</div>
                </div>
            </div>
        );
    }
}

SelectedContentItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
};
