"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseLoader = (function () {
    function BaseLoader(ctx) {
        this.ctx = ctx;
    }
    Object.defineProperty(BaseLoader.prototype, "option", {
        get: function () {
            return this.ctx.option;
        },
        enumerable: true,
        configurable: true
    });
    BaseLoader.prototype.load = function () {
        var _this = this;
        return this.taskDef
            .then(function (def) {
            if (def.loadConfig) {
                _this.ctx.setConfig(def.loadConfig(_this.ctx.option, _this.ctx.oper));
            }
            if (def['getContext']) {
                var cdef = def;
                var customCtx = cdef.getContext(_this.ctx.getConfig());
                _this.ctx.setConfig(customCtx.getConfig());
            }
            if (def['setContext']) {
                var cdef = def;
                cdef.setContext(_this.ctx);
            }
            return def;
        })
            .then(function (def) {
            return _this.loadTasks(_this.ctx, def);
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    Object.defineProperty(BaseLoader.prototype, "taskDef", {
        get: function () {
            if (!this._taskDef) {
                this._taskDef = Promise.resolve(this.loadTaskDefine());
            }
            return this._taskDef;
        },
        enumerable: true,
        configurable: true
    });
    BaseLoader.prototype.loadTasks = function (context, def) {
        def = def || {};
        if (def.tasks) {
            return def.tasks(context);
        }
        else if (def.loadTasks) {
            return def.loadTasks(context);
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
