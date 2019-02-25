import { handleRequestResponse } from '../../common/helpers/request.helper';
import { showErrorNotification } from '../../common/services/notification.service';

export const loadLocationItems = (parentLocationId, callback, limit = 50, offset = 0) => {
    const request = new Request(`/api/ezp/v2/location/tree/load-subitems/${parentLocationId}/${limit}/${offset}`, {
        method: 'GET',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/vnd.ez.api.ContentTreeNode+json'
        }
    });

    fetch(request)
        .then(handleRequestResponse)
        .then((data) => data.ContentTreeNode)
        .then(callback)
        .catch(showErrorNotification);
};
