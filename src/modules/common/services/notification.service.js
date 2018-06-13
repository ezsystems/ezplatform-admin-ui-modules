export const NOTIFICATION_INFO_LABEL = 'info';
export const NOTIFICATION_SUCCESS_LABEL = 'success';
export const NOTIFICATION_WARNING_LABEL = 'warning';
export const NOTIFICATION_DANGER_LABEL = 'danger';

/**
 * Dispatches notification event
 *
 * @method showNotification
 * @param {Object} detail
 */
export const showNotification = (detail) => {
    const event = new CustomEvent('ez-notify', {
        detail,
    });

    document.body.dispatchEvent(event);
};

/**
 * Dispatches info notification event
 *
 * @method showInfoNotification
 * @param {String} message
 */
export const showInfoNotification = (message) => {
    showNotification({
        message,
        label: NOTIFICATION_INFO_LABEL,
    });
};

/**
 * Dispatches success notification event
 *
 * @method showSuccessNotification
 * @param {String} message
 */
export const showSuccessNotification = (message) => {
    showNotification({
        message,
        label: NOTIFICATION_SUCCESS_LABEL,
    });
};

/**
 * Dispatches warning notification event
 *
 * @method showWarningNotification
 * @param {String} message
 */
export const showWarningNotification = (message) => {
    showNotification({
        message,
        label: NOTIFICATION_WARNING_LABEL,
    });
};

/**
 * Dispatches danger notification event
 *
 * @method showDangerNotification
 * @param {String} message
 */
export const showDangerNotification = (message) => {
    showNotification({
        message,
        label: NOTIFICATION_DANGER_LABEL,
    });
};

/**
 * Dispatches danger notification event
 *
 * @method showErrorNotification
 * @param {Error} error
 */
export const showErrorNotification = (error) => {
    showDangerNotification(error.message);
};
