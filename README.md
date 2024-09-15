### ReVerseVIEW - Rebirth of the old-school (Adobe AIR) VerseVIEW in a modest way possible

### Development - Setup
- JDK 1.8
- Adobe AIR SDK 32(adobe)/33(harman) (WebKit version) <= 33.1.1.743
- Node.js 20.x
- pnpm 9.x
- haxe 4.x

### Notes
- Typescript <5.5 is required for the project as 5.5 doesn't support ES3 target

#### Run
```shell
adl -nodebug ./application.xml ./app
```

#### Run (Debug)
```shell
adl ./application.xml ./app
```

#### Dump SWF
```shell
swfdump -abc ./app/lib/air/aircore.swf
```

# SWF Info

- aircore.swf
  - air.net.ServiceMonitor
  - air.net.URLMonitor
  - air.net.SocketMonitor
  - air.net.SecureSocketMonitor
  - air.desktop.URLFilePromise

- servicemonitor.swf
  - air.net.ServiceMonitor
  - air.net.URLMonitor
  - air.net.SocketMonitor
  - air.net.SecureSocketMonitor

- HTML: 4.x
- CSS: 2.x
- JS: ES3 + parts of ES5
  - no strict mode

# EcmaScript 5 Coverage
- [ ] Object/array literal extensions
  - [x] Getter accessors
  - [x] Setter accessors
  - [x] Trailing commas in object literals
  - [x] Trailing commas in array literals
  - [ ] Reserved words as property names
- [ ] Object static methods
  - [x] Object.create
  - [x] Object.defineProperty
  - [x] Object.defineProperties
  - [x] Object.getPrototypeOf
  - [x] Object.keys
  - [ ] Object.seal
  - [ ] Object.freeze
  - [ ] Object.preventExtensions
  - [ ] Object.isSealed
  - [ ] Object.isFrozen
  - [ ] Object.isExtensible
  - [x] Object.getOwnPropertyDescriptor
  - [x] Object.getOwnPropertyNames
- [ ] Array methods
  - [x] Array.isArray
  - [x] Array.prototype.indexOf
  - [x] Array.prototype.lastIndexOf
  - [x] Array.prototype.every
  - [x] Array.prototype.some
  - [x] Array.prototype.forEach
  - [x] Array.prototype.map
  - [x] Array.prototype.filter
  - [x] Array.prototype.reduce
  - [x] Array.prototype.reduceRight
  - [ ] Array.prototype.sort: compareFn must be function or undefined
  - [x] Array.prototype.sort: compareFn may be explicit undefined
  - [x] Array.prototype.unshift: [].unshift(0) returns the unshifted count
- [x] String properties and methods
  - [x] Property access on strings
  - [x] String.prototype.split
  - [x] String.prototype.substr
  - [x] String.prototype.trim
- [ ] Date methods
  - [x] Date.prototype.toISOString
  - [x] Date.now
  - [x] Date.prototype.toJSON
- [ ] Function.prototype.bind
- [x] JSON
- [x] Immutable globals
  - [x] undefined
  - [x] NaN
  - [x] Infinity
- [x] Number methods
  - [x] Number.prototype.toExponential rounds properly
  - [x] Number.prototype.toExponential throws on ±Infinity fractionDigits
  - [x] Number.prototype.toExponential does not throw on edge cases
- [ ] Miscellaneous
  - [ ] Function.prototype.apply permits array-likes
  - [ ] parseInt ignores leading zeros
  - [ ] Function "prototype" property is non-enumerable
  - [x] Arguments toStringTag is "Arguments"
  - [ ] Zero-width chars in identifiers
  - [x] Unreserved words
  - [ ] Enumerable properties can be shadowed by non-enumerables
  - [x] Thrown functions have proper "this" values
- [ ] Strict mode
  - [ ] reserved words
  - [ ] ........

### Development References & Resources
- https://github.com/yui/yui3
- https://github.com/yui/yui3-swfs
- https://github.com/liferay/alloy-ui
- https://github.com/evangoer/yui3-cookbook
- https://github.com/charlypoly/generator-yui3
- https://github.com/rockstar/yui3-nightly-tools
- https://alloyui.com/
- https://alloyui.com/api/
- https://alloyui.com/rosetta-stone/
- https://www.cdnpkg.com/alloy-ui
- https://github.com/liferay/alloy-ui/archive/3.1.0-deprecated.86.zip
- https://www.jsdelivr.com/package/npm/alloy-ui
- https://github.com/jingoro/yui3-elastic-textarea
- https://github.com/ericabouaf/yuitor
- https://github.com/colorhook/yui-tween
- https://github.com/tilomitra/tipsy
- https://tilomitra.github.io/tipsy/
- https://cdn.jsdelivr.net/npm/alloy-ui@3.1.0-deprecated.83/build/aui/aui-min.min.js
- https://cdn.jsdelivr.net/npm/alloy-ui@3.1.0-deprecated.83/build/resize-base/assets/skins/sam/resize-base.min.css
- https://gander.wustl.edu/~wilson/store/yui/api/
- https://github.com/liferay/liferay-frontend-projects/tree/master/third-party/projects/alloy-ui
- https://www.infernojs.org/docs/guides/installation
- https://glimmerjs.com/