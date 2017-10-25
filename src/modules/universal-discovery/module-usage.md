# Universal Discovery module - doc

Universal Discovery module allows you to browse the content structure and search for content using an interactive interface: the browse view and the search view. The module is highly configurable. It can be extended with new tabs.

## How to use it?

With vanilla JS:

```javascript
const container = document.querySelector('#udw');

ReactDOM.render(React.createElement(UniversalDiscovery.default, {
    onConfirm: {Function},
    onCancel: {Function},
}), container);
```

With JSX:

```jsx
const props = {
    onConfirm: {Function},
    onCancel: {Function}
};

<UniversalDiscoveryModule {...props} />
```

## Adding new tabs to the Universal Discovery module instance

The Universal Discovery module is highly customizable. It allows you to add new tabs to the module.

```jsx
const props = {
    onConfirm: {Function},
    onCancel: {Function},
    extraTabs: [{
        id: {String},
        title: {String},
        panel: {Element}, // React component that represents content of a tab
        attrs: {Object}
    }]
};

<UniversalDiscoveryModule {...props} />
```

Each tab definition is an object containing properties:

- **id** _{String}_ - unique tab identifier (it cannot be: `browse` or `search`),
- **title** _{String}_ - tab button title/label,
- **panel** _{Element}_ - any kind of React component. A panel component will receive the following props:
    - **isVisible** _{Boolean}_ - visible flag,
    - **onItemSelect** _{Function}_ - a callback to be invoked when content is selected,
    - **maxHeight** _{Number}_ - the maximum height of the panel container,
    - **id** _{String}_ - panel identifier,
    - **startingLocationId** _{Number}_ - location ID,
    - **findLocationsByParentLocationId** _{Function}_ - finds locations related to the parent location,
    - **findContentBySearchQuery** _{Function}_ - finds content matching a given text query,
    - **contentTypesMap** _{Object}_ - content types map with content type ids as keys,
    - **multiple** _{Boolean}_ - can select multiple content items flag,
    - **labels** _{Object}_ - a hash containing text messages to be placed across many places in a component,
- **attrs** {Object} - any optional list of props that should applied to the panel component. It can override the panel props listed above.

## Props list

The `<UniversalDiscoveryModule />` module can handle additional properties. There are 2 types of properties: **required** and **optional**. All of them are listed below.

### Required props

Without all the following properties the Universal Discovery module will not work.

**onConfirm** _{Function}_ - a callback to be invoked when a user clicks on the confirm button in a Universal Discovery popup. The function takes one param: `content` which is an array of content items structs.

**onCancel** _{Function}_ - a callback to be invoked when a user clicks on the cancel button in a Universal Discovery popup. It takes no extra params.

**restInfo** _{Function}_ - a config hash containing: token (_{String}_) and siteaccess (_{String}_).

### Optional props

Optionally, Universal Discovery module can take a following list of props:

**loadContentInfo** _{Function}_ - loads content info. It takes 3 params: `restInfo`, `contentId` and `callback`
**loadContentTypes** _{Function}_ - loads content types data. It takes 2 params: `restInfo`, `callback`,
**canSelectContent** _{Function}_ - checks whether a content item can be selected. It takes one param: `content` - the content struct,
**findContentBySearchQuery** _{Function}_ - finds a content using a search query. It takes 3 params: `restInfo`, `query` and `callback`,
**findLocationsByParentLocationId** _{Function}_ - finds sub items of a given location. It takes 3 params: `restInfo`, `parentLocationId` and `callback`,
**title** _{String}_ - the title of Universal Discovery popup. Default value: `Find content`,
**multiple** _{Boolean}_ - can select multiple content items flag. Default value: `true`,
**activeTab** _{String}_ - active tab identifier. Default value: `browse`,
**startingLocationId** _{Number}_ - location ID. Default value: `1`,
**maxHeight** _{Number}_ - maximum height of panel container. Default value: `500`,
**searchResultsPerPage** _{Number}_ - max amount of items visible per page in the search results. Default value: `10`,
**extraTabs** _{Array}_ - optional, extra tabs. Each tab definition is an object containing the following properties (all of them are required):
    - **id** _{String}_ - unique tab identifier (it cannot be: `browse` or `search`),
    - **title** _{String}_ - tab button title/label,
    - **panel** _{Element}_ - any kind of React component,
    - **attrs** _{Object}_ - any optional list of props that should applied to the panel component.
})),
**labels** _{Object}_ - a hash containing text messages to be placed across many places in a component. It contains text labels for child components:
    - **udw** _{Object}_ - a hash of text labels for Universal Discovery module,
    - **selectedContentItem** _{Object}_ - a hash of text labels for Selected Content Item component,
    - **contentMetaPreview** _{Object}_ - a hash of text labels for Content Meta Preview component,
    - **search** _{Object}_ - a hash of text labels for Search component,
    - **searchPagination** _{Object}_ - a hash of text labels for Search Pagination component,
    - **searchResults** _{Object}_ - a hash of text labels for Search Results component,
    - **searchResultsItem** _{Object}_ - a hash of text labels for Search Results Item component.
