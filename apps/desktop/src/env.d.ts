// declare var air: any;

// interface DojoToolkit {
//     Deferred: any;
//
//     dom: {
//         byId(id: string): any;
//     }
//
//     query: (selector: string) => any;
// }
//
// declare var $dtk: DojoToolkit;

interface YUI2 {
}

declare var YAHOO: YUI2;

interface YUI3 {
    Promise: any;
    Panel: any;

    Plugin: {
        AutoComplete: any;
    }

    // functions
    use(...args: any[]): void;

    one(selector: string): HTMLElement | null;
}

// We set this to YUI3 in "src/__preload__.ts"
declare var $Y: YUI3;

// declare var $RvW: any;
declare var rvw: any;