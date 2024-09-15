define(["node:querystring"], function (querystring) {
    return function (url) {
        return querystring.parse(url);
    };
});