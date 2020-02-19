import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FILTER_TIMEOUT = 200;

const InstantFilter = (props) => {
    const _refInstantFilter = useRef(null);
    const [filterQuery, setFilterQuery] = useState('');
    const [itemsMap, setItemsMap] = useState([]);

    let filterTimeout = null;

    useEffect(() => {
        const items = [..._refInstantFilter.current.querySelectorAll(`.${props.itemClass}`)];
        const itemsMap = items.map((item) => ({
            label: item.textContent.toLowerCase(),
            element: item,
        }));

        setItemsMap(itemsMap);
    }, []);

    useEffect(() => {
        const filterQueryLowerCase = filterQuery.toLowerCase();

        filterTimeout = window.setTimeout(() => {
            itemsMap.forEach((item) => {
                const methodName = item.label.includes(filterQueryLowerCase) ? 'removeAttribute' : 'setAttribute';
                item.element[methodName]('hidden', true);
            });
        }, FILTER_TIMEOUT);

        return () => {
            window.clearTimeout(filterTimeout);
        };
    }, [filterQuery]);

    return (
        <div className="ez-instant-filter" ref={_refInstantFilter}>
            <div className="ez-instant-filter__input-wrapper">
                <input
                    type="text"
                    className="ez-instant-filter__input form-control"
                    placeholder="Type to refine"
                    value={filterQuery}
                    onChange={(event) => setFilterQuery(event.target.value)}
                />
            </div>
            <div className="ez-instant-filter__items">
                {props.items.map((item) => {
                    const radioId = `${props.uniqueId}_${item.value}`;

                    return (
                        <div className={props.itemClass}>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id={radioId}
                                    name="items"
                                    className="form-check-input"
                                    value={item.value}
                                    onChange={() => props.handleItemChange(item.value)}
                                />
                                <label className="form-check-label" for={radioId}>
                                    {item.label}
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

InstantFilter.propTypes = {
    uniqueId: PropTypes.string,
    items: PropTypes.array,
    itemClass: PropTypes.string,
    handleItemChange: PropTypes.func,
};

InstantFilter.defaultProps = {
    uniqueId: 'item',
    items: [],
    itemClass: 'ez-instant-filter__item',
    handleItemChange: () => {},
};

export default InstantFilter;
