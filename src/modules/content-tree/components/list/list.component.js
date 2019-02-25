import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '../list-item/list.item.component';

const List = ({ items, loadMoreSubitems, currentLocationId, path }) => {
    const listAttrs = { loadMoreSubitems, currentLocationId };
    const listItemAttrs = { loadMoreSubitems };

    return (
        <ul className="c-list">
            {items.map((item) => {
                const hasPreviousPath = path && path.length;
                const itemPath = `${hasPreviousPath ? path + ',' : ''}${item.locationId}`;
                const { children, href, name, locationId, contentTypeIdentifier, isInvisible, totalChildrenCount } = item;

                return (
                    <ListItem
                        subitems={children}
                        href={href}
                        name={name}
                        locationId={locationId}
                        contentTypeIdentifier={contentTypeIdentifier}
                        isInvisible={isInvisible}
                        totalChildrenCount={totalChildrenCount}
                        {...listItemAttrs}
                        key={item.locationId}
                        selected={item.locationId === currentLocationId}
                        path={itemPath}>
                        {children.length ? <List path={itemPath} items={children} {...listAttrs} /> : null}
                    </ListItem>
                );
            })}
        </ul>
    );
};

List.propTypes = {
    path: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    loadMoreSubitems: PropTypes.func.isRequired,
    currentLocationId: PropTypes.number.isRequired,
};

export default List;
