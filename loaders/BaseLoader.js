"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var development_core_1 = require('development-core');
// import * as chalk from 'chalk';
var dynamicTaskDefine_1 = require('./dynamicTaskDefine');

var BaseLoader = function () {
    function BaseLoader(option) {
        _classCallCheck(this, BaseLoader);

        this.option = option;
    }

    _createClass(BaseLoader, [{
        key: 'load',
        value: function load(cfg) {
            var _this = this;

            return this.getTaskDefine().then(function (def) {
                if (def.loadTasks) {
                    return def.loadTasks(cfg);
                } else {
                    var mdl = _this.getTaskModule();
                    return cfg.findTasks(mdl);
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
    }, {
        key: 'loadConfg',
        value: function loadConfg(env) {
            var _this2 = this;

            return this.getTaskDefine().then(function (def) {
                return def.loadConfig(_this2.option, env);
            }).then(function (config) {
                return _this2.bindingConfig(config);
            }).catch(function (err) {
                console.error(err);
            });
        }
    }, {
        key: 'bindingConfig',
        value: function bindingConfig(cfg) {
            cfg = development_core_1.bindingConfig(cfg);
            return cfg;
        }
    }, {
        key: 'getTaskDefine',
        value: function getTaskDefine() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var loader = _this3.option.loader;
                if (loader.taskDefine) {
                    resolve(loader.taskDefine);
                } else {
                    (function () {
                        var mdl = _this3.getConfigModule();
                        development_core_1.findTaskDefineInModule(mdl).then(function (def) {
                            resolve(def);
                        }).catch(function (err) {
                            resolve(dynamicTaskDefine_1.default(mdl));
                        });
                    })();
                }
            });
        }
    }, {
        key: 'getConfigModule',
        value: function getConfigModule() {
            var loader = this.option.loader;
            return loader.configModule || loader.module;
        }
    }, {
        key: 'getTaskModule',
        value: function getTaskModule() {
            var loader = this.option.loader;
            return loader.taskModule || loader.module;
        }
    }]);

    return BaseLoader;
}();

exports.BaseLoader = BaseLoader;
//# sourceMappingURL=../sourcemaps/loaders/BaseLoader.js.map
