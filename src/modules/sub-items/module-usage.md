# Sub Items List

Sub Items List module is meant to be used as a part of the editorial interface of eZ Platform. It provides an interface for listing the sub items of any location.

## How to use it?

With vanilla JS:

```javascript
React.createElement(SubItemsList.default, {
    parentLocationId: {Number},
    restInfo: {
        token: {String},
        siteaccess: {String}
    }
});
```

With JSX:

```jsx
const attrs = {
    parentLocationId: {Number},
    restInfo: {
        token: {String},
        siteaccess: {String}
    }
};

<SubItemsModule {...attrs}/>
```

## Props list

The `<SubItemsModule />` module can handle additional properties. There are 2 types of properties: **required** and **optional**. All of them are listed below.

### Required props

Without all the following properties the Sub Items module will not work.

**parentLocationId** _{Number}_ - parent location ID.

**locationViewLink** _{String}_ - a link pattern sub item location view. It should follow the pattern similar to: `/admin/content/location/{{locationId}}`

**restInfo** _{Object}_ - backend config object:

- **token** _{String}_ - CSRF token,
- **siteaccess** _{String}_ - SiteAccess identifier.

### Optional props

Optionally, Sub Items module can take a following list of props:

**loadContentInfo** _{Function}_ - loads content items info. Takes 2 params:

- **contentIds** _{Array}_ - list of content IDs,
- **callback** _{Function}_ - a callback invoked when content info is loaded.

**loadContentTypes** _{Function}_ - loads content types. Takes one param:

- **callback** _{Function}_ - callback invoked when content types are loaded.

**loadLocation** _{Function}_ - loads location. Takes 3 params:

- **restInfo** _{Object}_ - rest info params:
    - **token** _{String}_ - the user token,
    - **siteaccess** _{String}_ the current siteaccess.
- **queryConfig** _{Object}_ query config:
    - **locationId** _{Number}_ - location ID,
    - **limit** _{Number}_ - content items limit,
    - **offset** _{Number}_ - items offset,
    - **sortClauses** _{Object}_ - the sort clauses, ex: {LocationPriority: 'ascending'},
- **callback** _{Function}_ - callback invoked when location is loaded.

**updateLocationPriority** - updates item location priority. Takes 2 params:

- **params** _{Object}_ - parameters hash containing:
    - **priority** _{Number}_ - priority value
    - **location** _{String}_ - REST location id,
    - **token** _{String}_ - CSRF token,
    - **siteaccess** _{String}_ - SiteAccess identifier.
- **callback** _{Function}_ - callback invoked when content location priority is updated.

**activeView** _{String}_ - active list view identifier

**extraActions** _{Array}_ - list of extra actions. Each action is an object containing:

- **component** _{Element}_ - React component class,
- **attrs** _{Object}_ - additional component properties

**items** _{Array}_ - list of location sub items

**limit** _{Number}_ - items limit count

**offset** _{Number}_ - items limit offset

**labels** _{Object}_ - list of module labels. Contains definitions for sub components:

- **subItems** _{Object}_ - list of sub items module labels,
- **tableView** _{Object}_ - list of table view component labels,
- **tableViewItem** _{Object}_ - list of table item view component labels,
- **loadMore** _{Object}_ - list of load more component labels,
- **gridViewItem** _{Object}_ - list of grid item view component labels.
