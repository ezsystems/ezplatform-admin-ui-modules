export const classnames = (classes) => {
    return Object.entries(classes).reduce((total, [name, condition]) => {
        return `${total} ${condition ? name : ''}`;
    }, '');
};
