import { handleRequestResponse } from '../../common/helpers/request.helper';
import { showErrorNotification } from '../../common/services/notification.service';

const ENDPOINT_LOAD_SUBITEMS = '/api/ezp/v2/location/tree/load-subitems';
const ENDPOINT_LOAD_SUBTREE = '/api/ezp/v2/location/tree/load-subtree';

export const loadLocationItems = (parentLocationId, callback, limit = 50, offset = 0) => {
    const request = new Request(`${ENDPOINT_LOAD_SUBITEMS}/${parentLocationId}/${limit}/${offset}`, {
        method: 'GET',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/vnd.ez.api.ContentTreeNode+json',
        },
    });

    // fetch(request)
    //     .then(handleRequestResponse)
    //     .then((data) => {
    //         const location = data.ContentTreeNode;

    //         location.children = location.children.map(mapChildrenToSubitems)

    //         return mapChildrenToSubitems(location);
    //     })
    //     .then(callback)
    //     .catch(showErrorNotification);
};

const mapChildrenToSubitems = (location) => {
    location.totalSubitemsCount = location.totalChildrenCount;
    location.subitems = location.children;

    delete location.totalChildrenCount;
    delete location.children;

    return location;
};
