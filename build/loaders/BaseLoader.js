"use strict";
var BaseLoader = (function () {
    function BaseLoader(option, env, factory) {
        this.option = option;
        this.env = env;
        this.factory = factory;
    }
    BaseLoader.prototype.load = function (context) {
        var _this = this;
        return this.contextDef
            .then(function (def) {
            return _this.loadTasks(context, def);
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    BaseLoader.prototype.loadContext = function (env) {
        this.env = env;
        var self = this;
        return this.contextDef
            .then(function (def) {
            return def.getContext({
                option: self.option,
                env: env,
                createContext: self.factory
            });
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    Object.defineProperty(BaseLoader.prototype, "contextDef", {
        get: function () {
            if (!this._contextDef) {
                this._contextDef = Promise.resolve(this.getContextDefine());
            }
            return this._contextDef;
        },
        enumerable: true,
        configurable: true
    });
    BaseLoader.prototype.loadTasks = function (context, def) {
        if (def.tasks) {
            return def.tasks(context);
        }
        else {
            var mdl = this.getTaskModule();
            return context.findTasks(mdl);
        }
    };
    BaseLoader.prototype.getConfigModule = function () {
        var loader = this.option.loader;
        return loader.configModule || loader.module;
    };
    BaseLoader.prototype.getTaskModule = function () {
        var loader = this.option.loader;
        return loader.taskModule || loader.module;
    };
    return BaseLoader;
}());
exports.BaseLoader = BaseLoader;

//# sourceMappingURL=../sourcemaps/loaders/BaseLoader.js.map
