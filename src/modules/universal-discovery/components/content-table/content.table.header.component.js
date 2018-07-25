import React from 'react';

import './css/content.table.header.component.css';

const ContentTableHeaderComponent = () => {
    const nameLabel = Translator.trans(/*@Desc("Name")*/ 'content_table.header.name', {}, 'universal_discovery_widget');
    const typeLabel = Translator.trans(/*@Desc("Content Type")*/ 'content_table.header.type', {}, 'universal_discovery_widget');

    return (
        <div className="c-content-table-header__list-headers">
            <div className="c-content-table-header__list-header--name">{nameLabel}</div>
            <div className="c-content-table-header__list-header--type">{typeLabel}</div>
            <div className="c-content-table-header__list-header--span" />
        </div>
    );
};

export default ContentTableHeaderComponent;
