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
                <ListItem key {...item}>
                    {item.subItems.length && <List items={item.subItems} />}
                </ListItem>
            ))}
        </ul>
    );
};

List.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default List;
