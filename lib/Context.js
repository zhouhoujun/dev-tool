"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var development_core_1 = require("development-core");
var _ = require("lodash");
var loaderFactory_1 = require("./loaderFactory");
var Builder_1 = require("./Builder");
var factory = new loaderFactory_1.LoaderFactory();
var builder = new Builder_1.ContextBuilder();
/**
* create Context instance.
*
* @static
* @param {(ITaskConfig | TaskOption)} cfg
* @param {IContext} [parent]
* @returns {IContext}
* @memberof Context
*/
function createConextInstance(cfg, parent) {
    var config = (cfg['option'] ? cfg : { option: cfg });
    return new Context(config, parent);
}
exports.createConextInstance = createConextInstance;
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
var Context = (function (_super) {
    __extends(Context, _super);
    // private children: IContext[] = [];
    function Context(cfg, parent) {
        var _this = _super.call(this, cfg, parent) || this;
        _this.loading = false;
        _this._builder = builder;
        return _this;
    }
    Object.defineProperty(Context.prototype, "loaderFactory", {
        get: function () {
            return this._loaderfactory || factory;
        },
        set: function (fac) {
            this._loaderfactory = fac;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * create new context;
     *
     * @param {ITaskConfig} cfg
     * @param {ITaskContext} [parent] default current context.
     * @returns {ITaskContext}
     * @memberof TaskContext
     */
    Context.prototype.createContext = function (cfg, parent) {
        return createConextInstance(cfg, _.isUndefined(parent) ? this : parent);
    };
    Context.prototype.addTask = function () {
        var _this = this;
        var task = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            task[_i] = arguments[_i];
        }
        if (this.loading) {
            _super.prototype.addTask.apply(this, task);
            return;
        }
        this.getLoaderTasks()
            .then(function (tasks) {
            _super.prototype.addTask.apply(_this, task);
        });
    };
    Context.prototype.removeTask = function (task) {
        var _this = this;
        if (this.loading) {
            return _super.prototype.removeTask.call(this, task);
        }
        return this.getLoaderTasks()
            .then(function (tasks) {
            return _super.prototype.removeTask.call(_this, task);
        });
    };
    Context.prototype.getLoaderTasks = function () {
        var _this = this;
        if (!this._loaderTasks) {
            this.loading = true;
            this._loaderTasks = this.loaderFactory.create(this)
                .load()
                .then(function (tks) {
                _this.loading = false;
                return tks;
            }, function (err) {
                _this.loading = false;
                console.log(err);
                return null;
            });
        }
        return this._loaderTasks;
    };
    /**
     * setup tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    Context.prototype.setupTasks = function () {
        var _this = this;
        return this.getLoaderTasks()
            .then(function (tsq) {
            return _super.prototype.setupTasks.call(_this);
        })
            .catch(function (err) {
            console.error(err);
            process.exit(1);
            return null;
        });
    };
    // todo: debug.
    // setup() {
    //     return super.setup()
    //         .then((data) => {
    //             console.log('task seq:', data);
    //             return data;
    //         })
    // }
    // run() {
    //     this.builder.build(this);
    //     return super.run();
    // }
    Context.prototype.start = function () {
        var _this = this;
        var gulp = this.gulp;
        var isRoot = !this.parent;
        var btsk = isRoot ? 'build' : "build-" + this.toStr(this.option.name);
        gulp.task(btsk, function (callback) {
            return _this.run();
        });
        gulp.task(isRoot ? 'start' : "start-" + this.toStr(this.option.name), function (callback) {
            if (!_this.env.task) {
                return Promise.reject('start task can not empty!');
            }
            var tasks = _this.env.task.split(',');
            return _this.find(function (ctx) { return tasks.indexOf(ctx.toStr(ctx.option.name)) >= 0; })
                .run();
        });
        if (!this.parent) {
            gulp.task('default', function () {
                gulp.start(btsk);
            });
        }
        return Promise.resolve([btsk]);
    };
    return Context;
}(development_core_1.TaskContext));
exports.Context = Context;

//# sourceMappingURL=sourcemaps/Context.js.map
