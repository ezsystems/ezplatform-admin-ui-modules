import { handleRequestResponse } from '../../common/helpers/request.helper';
import { showErrorNotification } from '../../common/services/notification.service';

export const loadLocationItems = (parentLocationId, callback, limit = 50, offset = 0) => {
    const request = new Request(`/admin/location/tree/load-subitems/${parentLocationId}/${limit}/${offset}`, {
        method: 'GET',
        mode: 'same-origin',
        credentials: 'same-origin',
    });

    fetch(request)
        .then(handleRequestResponse)
        .then(callback)
        .catch(showErrorNotification);
};
