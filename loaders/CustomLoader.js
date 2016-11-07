"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var development_core_1 = require('development-core');

var CustomLoader = function () {
    function CustomLoader(option, loader) {
        _classCallCheck(this, CustomLoader);

        this.option = option;
        this.loader = loader;
    }

    _createClass(CustomLoader, [{
        key: "load",
        value: function load(cfg) {
            return Promise.resolve(this.loader(cfg));
        }
    }, {
        key: "loadConfg",
        value: function loadConfg(env) {
            var self = this;
            return Promise.resolve({
                option: self.option,
                env: env
            }).then(function (config) {
                return development_core_1.bindingConfig(config);
            });
        }
    }, {
        key: "getTaskDefine",
        value: function getTaskDefine() {
            var tsdef = {
                loadConfig: function loadConfig(option, env) {
                    return {
                        env: env,
                        option: option
                    };
                }
            };
            return Promise.resolve(tsdef);
        }
    }]);

    return CustomLoader;
}();

exports.CustomLoader = CustomLoader;
//# sourceMappingURL=../sourcemaps/loaders/CustomLoader.js.map
