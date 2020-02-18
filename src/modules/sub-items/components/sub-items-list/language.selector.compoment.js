import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { createCssClassNames } from '../../../common/helpers/css.class.names';

const LanguageSelector = (props) => {
    const [className, setClassName] = useState({
        'ez-extra-actions': true,
        'ez-extra-actions--edit': true,
        'ez-language-selector': true,
        'ez-extra-actions--hidden': props.content ? false : true,
    });

    const closeLanguageSelector = (event) => {
        if (!event.target.closest('.c-table-view-item__btn') && !event.target.classList.contains('ez-instant-filter__input')) {
            setClassName({ ...className, 'ez-extra-actions--hidden': true });
        }
    };

    useEffect(() => {
        window.document.addEventListener('click', closeLanguageSelector, false);

        return () => {
            window.document.removeEventListener('click', closeLanguageSelector);
        };
    }, []);

    useEffect(() => {
        setClassName({ ...className, 'ez-extra-actions--hidden': props.content ? false : true });
    }, [props.content]);

    return <div className={createCssClassNames(className)}>{props.content}</div>;
};

LanguageSelector.propTypes = {
    content: PropTypes.symbol,
};

export default LanguageSelector;
