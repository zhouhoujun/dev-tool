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
var _ = require("lodash");
var Context_1 = require("./Context");
var development_core_1 = require("development-core");
/**
 * Development.
 *
 * @export
 * @class Development
 * @extends {Context}
 */
var Development = /** @class */ (function (_super) {
    __extends(Development, _super);
    /**
     * Creates an instance of Development.
     * @param {ITaskConfig} config
     * @param {string} root root path.
     * @param {IContext} [parent]
     * @memberof Development
     */
    function Development(config, root) {
        var _this = _super.call(this, config) || this;
        _this.root = root;
        _this.setConfig({
            env: { root: root },
            printHelp: _this.cfg.printHelp || _this.printHelp
        });
        return _this;
    }
    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} root  root path.
     * @param {(ITaskConfig | Array<IAssertOption | ITaskOption | IDynamicTaskOption>)} setting
     * @param {any} [runWay=RunWay.sequence]
     * @returns {Development}
     *
     * @memberOf Development
     */
    Development.create = function (gulp, root, setting, name, runWay) {
        if (name === void 0) { name = ''; }
        if (runWay === void 0) { runWay = development_core_1.RunWay.sequence; }
        var config;
        var option;
        if (_.isArray(setting)) {
            config = { option: { name: name, tasks: setting, runWay: runWay, loader: [] } };
        }
        else {
            config = setting;
            option = config.option;
            option.name = option.name || name;
            if (!_.isUndefined(option.runWay)) {
                option.runWay = runWay;
            }
        }
        var devtool = new Development(config, root);
        devtool.gulp = gulp;
        return devtool;
    };
    Development.prototype.getRootPath = function () {
        return this.root || _super.prototype.getRootPath.call(this);
    };
    /**
     * get all tasks sequence
     */
    Development.prototype.allTasks = function () {
        return this.map(function (t) {
            t.getRunSequence();
        });
    };
    /**
     * start task.
     *
     * @returns {Src}
     * @memberof Development
     */
    Development.prototype.start = function () {
        var _this = this;
        var gulp = this.gulp;
        var isRoot = !this.parent;
        var btsk = isRoot ? 'build' : "build-" + this.taskName(this.option.name);
        gulp.task(btsk, function (callback) {
            return _this.run();
        });
        gulp.task(isRoot ? 'start' : "start-" + this.taskName(this.option.name), function (callback) {
            var tasks = _this.env.task ? _this.env.task.split(',') : [];
            var contextname = _this.env['context'];
            var runCtx = contextname ? _this.find(function (ctx) { return ctx.toStr(ctx.option.name) === contextname; }) : _this;
            var tskprocess;
            if (tasks && tasks.length > 0) {
                tskprocess = runCtx.setup()
                    .then(function () {
                    var excTasks = [];
                    tasks.forEach(function (tk) {
                        runCtx.each(function (c) {
                            _.each(_.flatten(c.getRunSequence()), function (t) {
                                if (t.endsWith(tk) && excTasks.indexOf(t) < 0) {
                                    excTasks.push(t);
                                }
                            });
                        });
                    });
                    _this.runSequence(excTasks);
                });
            }
            else {
                tskprocess = runCtx.run();
            }
            return tskprocess
                .catch(function (err) {
                process.exit(_.isNumber(err) ? err : 1);
            });
        });
        if (!this.parent) {
            gulp.task('default', function () {
                gulp.start(btsk);
            });
        }
        return btsk;
    };
    Development.prototype.printHelp = function (help) {
        if (help === 'en') {
            console.log("\n                /**\n                 * gulp [start] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env  development or production;\n                 *  --context app setting\n                 *  --root path, set relative path of the development tool root.\n                 *  --watch  watch src file change or not. if changed will auto update to node service.\n                 *  --release release web app or not. if [--env production], default to release.\n                 *  --test  need auto load test file to node service.\n                 *  --deploy run deploy tasks to deploy project.\n                 *  --serve start node web service or not.\n                 *  --task taskname  spruce task taskname, etc: --task task1,task2\n                 **/");
        }
        else {
            console.log("\n                /**\n                 * gulp [start] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env \u53D1\u5E03\u73AF\u5883 \u9ED8\u8BA4\u5F00\u53D1\u73AF\u5883development;\n                 *  --context \u8BBE\u7F6E\u914D\u7F6E\u6587\u4EF6;\n                 *  --root path, \u8BBE\u7F6E\u7F16\u8BD1\u73AF\u5883\u76F8\u5BF9\u8DEF\u5F84\n                 *  --watch  \u662F\u5426\u9700\u8981\u52A8\u6001\u76D1\u542C\u6587\u4EF6\u53D8\u5316\n                 *  --release \u662F\u5426release\u7F16\u8BD1, [--env production] \u9ED8\u8BA4release\n                 *  --test  \u542F\u52A8\u81EA\u52A8\u5316\u6D4B\u8BD5\n                 *  --deploy \u8FD0\u884C\u52A0\u8F7Ddeploy tasks, \u7F16\u8BD1\u53D1\u5E03\u9879\u76EE\u3002\n                 *  --serve  \u662F\u5426\u5728\u5F00\u53D1\u6A21\u5F0F\u4E0B \u5F00\u542Fnode web\u670D\u52A1\n                 *  --task taskname  \u8FD0\u884C\u5355\u72EC\u4EFB\u52A1taskname, etc: --task task1,task2\n                 **/");
        }
    };
    return Development;
}(Context_1.Context));
exports.Development = Development;

//# sourceMappingURL=sourcemaps/Development.js.map
