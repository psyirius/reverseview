rvw.provide("rvw.store").Preferences = {
    __Store: class {
        constructor(root = {}, onCommit = null) {
            this.__root = root;
            this.__commit = onCommit;
        }

        static fromJSON(json, onCommit = null) {
            return new this(json, onCommit);
        }

        toJSON() {
            return this.__root;
        }

        get(key, defaultValue = undefined) {
            let item = this.__root;

            for (const ksp of key.split(".")) {
                if (typeof item[ksp] === "undefined") {
                    return defaultValue;
                }

                item = item[ksp];
            }

            return item;
        }

        set(key, value) {
            let item = this.__root;

            const ksl = key.split(".");
            const last = ksl.pop();

            for (const ksp of ksl) {
                if (typeof item[ksp] === "undefined") {
                    item[ksp] = {};
                }

                item = item[ksp];
            }

            item[last] = value;
        }

        merge(key, value) {
            let item = this.__root;

            const ksl = key.split(".");
            const last = ksl.pop();

            for (const ksp of ksl) {
                if (typeof item[ksp] === "undefined") {
                    item[ksp] = {};
                }

                item = item[ksp];
            }

            item[last] = Object.assign({}, item[last], value);
        }

        commit() {
            if (this.__commit) {
                this.__commit(this);
            }
        }
    },
    defaults() {
        return {
            app: {
                theme: "default",
            },
        }
    },
    init(file, callback) {
        const store = this.__Store.fromJSON(this.defaults(), (store) => {
            this.save(file, store, (err) => {
                if (err) air.trace('Prefs::init: ' + err);
            });
        });

        if (!file.parent.exists) {
            file.parent.createDirectory();
        }

        this.save(file, store, (err) => {
            callback(err, store);
        });
    },
    load(file, callback) {
        try {
            const { FileStream, FileMode } = air;

            const prefsFS = new FileStream();
            prefsFS.open(file, FileMode.READ);
            const data = prefsFS.readMultiByte(prefsFS.bytesAvailable, 'utf-8');
            prefsFS.close();

            callback(null, this.__Store.fromJSON(JSON.parse(data), (store) => {
                this.save(file, store, (err) => {
                    if (err) air.trace('Prefs::load: ' + err);
                });
            }));
        } catch (e) {
            callback(e, null);
        }
    },
    save(file, store, callback) {
        try {
            const { FileStream, FileMode } = air;

            const data = JSON.stringify(store.toJSON());

            const prefsFS = new FileStream();
            prefsFS.open(file, FileMode.WRITE);
            prefsFS.writeMultiByte(data, 'utf-8');
            prefsFS.close();

            callback(null);
        } catch (e) {
            callback(e);
        }
    }
};