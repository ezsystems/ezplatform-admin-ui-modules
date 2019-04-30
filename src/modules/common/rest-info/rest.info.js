const token = window.document.querySelector('meta[name="CSRF-Token"]').content;
const siteaccess = window.document.querySelector('meta[name="SiteAccess"]').content;
export const restInfo = { token, siteaccess };
