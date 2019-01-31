import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '../list-item/list.item.component';

const List = (props) => {
    const listAttrs = {
        className: 'c-list',
    };

    return (
        <ul {...listAttrs}>
            {props.items.map((item) => (
                <ListItem key={item.id} {...item} selected={item.id === props.selectedLocationId} onItemClick={props.onItemClick}>
                    {item.subItems.length ? (
                        <List items={item.subItems} selectedLocationId={props.selectedLocationId} onItemClick={props.onItemClick} />
                    ) : null}
                </ListItem>
            ))}
        </ul>
    );
};

List.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedLocationId: PropTypes.number,
    onItemClick: PropTypes.func.isRequired,
};

export default List;
