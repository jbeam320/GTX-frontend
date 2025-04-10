export const formatUrl = (url: string) => {
    // ensure the url ends with a slash (/)
    if (!url.endsWith('/')) {
        url += '/';
    }
    return url;
}
