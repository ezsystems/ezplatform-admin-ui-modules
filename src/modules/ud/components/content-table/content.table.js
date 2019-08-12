import React from 'react';
import PropTypes from 'prop-types';

import ContentTableItem from './content.table.item';

import Pagination from '../../../common/pagination/pagination';

const ContentTable = ({ count, itemsPerPage, items, activePageIndex, title, onPageChange }) => {
    return (
        <div className="c-content-table">
            <div className="c-content-table__title">{title}</div>
            <div className="c-content-table__items">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Modified</th>
                            <th>Content Type</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <ContentTableItem key={item.id} location={item} />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="c-content-table__pagination">
                <Pagination
                    proximity={1}
                    itemsPerPage={itemsPerPage}
                    activePageIndex={activePageIndex}
                    totalCount={count}
                    onPageChange={onPageChange}
                    disabled={false}
                />
            </div>
        </div>
    );
};

ContentTable.propTypes = {
    count: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    activePageIndex: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default ContentTable;
