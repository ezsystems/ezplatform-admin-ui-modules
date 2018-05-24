/**
 * Creates error notification
 *
 * @method showErrorNotification
 * @param {Error} error
 */
export const showErrorNotification = (error) => {
    const event = new CustomEvent('ez-notify', {
        detail: {
            label: 'danger',
            message: error.message
        }
    });

    document.body.dispatchEvent(event);
}
