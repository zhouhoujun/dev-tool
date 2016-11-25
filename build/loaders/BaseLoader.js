"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseLoader = function () {
    function BaseLoader(option, env, factory) {
        _classCallCheck(this, BaseLoader);

        this.option = option;
        this.env = env;
        this.factory = factory;
    }

    _createClass(BaseLoader, [{
        key: "load",
        value: function load(context) {
            var _this = this;

            return this.contextDef.then(function (def) {
                return _this.loadTasks(context, def);
            }).catch(function (err) {
                console.error(err);
            });
        }
    }, {
        key: "loadContext",
        value: function loadContext(env) {
            this.env = env;
            var self = this;
            return this.contextDef.then(function (def) {
                return def.getContext({
                    option: self.option,
                    env: env,
                    createContext: self.factory
                });
            }).catch(function (err) {
                console.error(err);
            });
        }
    }, {
        key: "loadTasks",
        value: function loadTasks(context, def) {
            if (def.tasks) {
                return def.tasks(context);
            } else {
                var mdl = this.getTaskModule();
                return context.findTasks(mdl);
            }
        }
    }, {
        key: "getConfigModule",
        value: function getConfigModule() {
            var loader = this.option.loader;
            return loader.configModule || loader.module;
        }
    }, {
        key: "getTaskModule",
        value: function getTaskModule() {
            var loader = this.option.loader;
            return loader.taskModule || loader.module;
        }
    }, {
        key: "contextDef",
        get: function get() {
            if (!this._contextDef) {
                this._contextDef = Promise.resolve(this.getContextDefine());
            }
            return this._contextDef;
        }
    }]);

    return BaseLoader;
}();

exports.BaseLoader = BaseLoader;
//# sourceMappingURL=../sourcemaps/loaders/BaseLoader.js.map
