"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var development_core_1 = require('development-core');

var CustomLoader = function () {
    function CustomLoader(option, loader, factory) {
        _classCallCheck(this, CustomLoader);

        this.option = option;
        this.loader = loader;
        this.factory = factory;
    }

    _createClass(CustomLoader, [{
        key: "load",
        value: function load(context) {
            return Promise.resolve(this.loader(context));
        }
    }, {
        key: "loadContext",
        value: function loadContext(env) {
            var self = this;
            this.condef = this.condef || Promise.resolve(development_core_1.bindingConfig({
                option: self.option,
                env: env,
                createContext: self.factory
            }));
            return this.condef;
        }
    }]);

    return CustomLoader;
}();

exports.CustomLoader = CustomLoader;
//# sourceMappingURL=../sourcemaps/loaders/CustomLoader.js.map
