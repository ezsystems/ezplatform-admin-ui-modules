interface ILocation extends IRef {
    Children: IRef;
    Content: IRef;
    ContentInfo: IRef;
    ParentLocation: IRef;
    UrlAliases: IRef;
    childCount: number;
    depth: number;
    hidden: boolean;
    id: number;
    invisible: boolean;
    pathString: string;
    priority: number;
    remoteId: string;
    sortField: string;
    sortOrder: sortOrderType;
}
