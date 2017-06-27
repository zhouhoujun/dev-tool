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
var development_core_1 = require("development-core");
var Context_1 = require("./Context");
/**
 * Development.
 *
 * @export
 * @class Development
 * @extends {Context}
 */
var Development = (function (_super) {
    __extends(Development, _super);
    /**
     * Creates an instance of Development.
     * @param {ITaskConfig} config
     * @param {string} root root path.
     * @param {IContext} [parent]
     * @memberof Development
     */
    function Development(config, root, parent) {
        var _this = _super.call(this, config, parent) || this;
        _this.setConfig({
            env: { root: root },
            printHelp: _this.cfg.printHelp || _this.printHelp
        });
        _this.builder();
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
        devtool.start();
        return devtool;
    };
    /**
     * build context component.
     *
     * @protected
     * @memberof Development
     */
    Development.prototype.builder = function () {
        var opt = this.option;
        this.buildContext(opt, this);
    };
    Development.prototype.printHelp = function (help) {
        if (help === 'en') {
            console.log("\n                /**\n                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env  development or production;\n                 *  --context app setting\n                 *  --root path, set relative path of the development tool root.\n                 *  --watch  watch src file change or not. if changed will auto update to node service.\n                 *  --release release web app or not. if [--env production], default to release.\n                 *  --test  need auto load test file to node service.\n                 *  --deploy run deploy tasks to deploy project.\n                 *  --serve start node web service or not.\n                 *  --task taskname  spruce task taskname\n                 **/");
        }
        else {
            console.log("\n                /**\n                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env \u53D1\u5E03\u73AF\u5883 \u9ED8\u8BA4\u5F00\u53D1\u73AF\u5883development;\n                 *  --context \u8BBE\u7F6E\u914D\u7F6E\u6587\u4EF6;\n                 *  --root path, \u8BBE\u7F6E\u7F16\u8BD1\u73AF\u5883\u76F8\u5BF9\u8DEF\u5F84\n                 *  --watch  \u662F\u5426\u9700\u8981\u52A8\u6001\u76D1\u542C\u6587\u4EF6\u53D8\u5316\n                 *  --release \u662F\u5426release\u7F16\u8BD1, [--env production] \u9ED8\u8BA4release\n                 *  --test  \u542F\u52A8\u81EA\u52A8\u5316\u6D4B\u8BD5\n                 *  --deploy \u8FD0\u884C\u52A0\u8F7Ddeploy tasks, \u7F16\u8BD1\u53D1\u5E03\u9879\u76EE\u3002\n                 *  --serve  \u662F\u5426\u5728\u5F00\u53D1\u6A21\u5F0F\u4E0B \u5F00\u542Fnode web\u670D\u52A1\n                 *  --task taskname  \u8FD0\u884C\u5355\u72EC\u4EFB\u52A1taskname\n                 **/");
        }
    };
    /**
     * build asserts tasks.
     *
     * @protected
     * @param {ITaskContext} ctx
     *
     * @memberOf Development
     */
    Development.prototype.buildAssertContext = function (ctx) {
        var optask = ctx.option;
        // console.log('assert options:', optask);
        var tasks = [];
        _.each(_.keys(optask.asserts), function (name) {
            var op;
            var sr = optask.asserts[name];
            if (_.isString(sr)) {
                op = { src: sr };
            }
            else if (_.isNumber(sr)) {
                // watch with Operation.autoWatch.
                op = { loader: [{ oper: sr, name: name, pipes: [] }] };
            }
            else if (_.isFunction(sr)) {
                op = { loader: sr };
            }
            else if (_.isArray(sr)) {
                if (sr.length > 0) {
                    if (!_.some(sr, function (it) { return !_.isString(it); })) {
                        op = { src: sr };
                    }
                    else {
                        op = { loader: sr, watch: true };
                    }
                }
            }
            else {
                op = sr;
            }
            if (_.isNull(op) || _.isUndefined(op)) {
                return;
            }
            if (!op.loader) {
                op.loader = [{ name: name, pipes: [], watch: true }];
            }
            op.name = op.name || ctx.subTaskName(name);
            op.src = op.src || (ctx.getSrc({ oper: development_core_1.Operation.default }) + '/**/*.' + name);
            // op.dist = op.dist || ctx.getDist({ oper: Operation.build });
            op.runWay = op.runWay || optask.assertsRunWay || development_core_1.RunWay.parallel;
            tasks.push(op);
        });
        // console.log('assert tasks:', tasks);
        this.buildContext(tasks, ctx);
    };
    Development.prototype.buildContext = function (taskOptions, parent) {
        var _this = this;
        var tasks = _.isArray(taskOptions) ? taskOptions : [taskOptions];
        tasks.forEach(function (optask) {
            if (optask.oper && _this.oper && (_this.oper & optask.oper) <= 0) {
                return;
            }
            var ctx = Context_1.createConextInstance(optask, parent);
            if (optask.asserts) {
                var assert = Context_1.createConextInstance(_.extend({ name: 'asserts', loader: [], asserts: optask.asserts, order: optask.assertsOrder, assertsRunWay: optask.assertsRunWay }), ctx);
                _this.buildAssertContext(assert);
            }
            if (optask.tasks) {
                _this.buildSubContext(ctx);
            }
        });
    };
    /**
     * build sub context.
     *
     * @protected
     * @param {IContext} ctx
     *
     * @memberOf Development
     */
    Development.prototype.buildSubContext = function (ctx) {
        var optask = ctx.option;
        // console.log('task options:', optask);
        if (!optask.tasks) {
            return;
        }
        var tasks = _.isArray(optask.tasks) ? optask.tasks : [optask.tasks];
        var subtasks = tasks.map(function (subopt) {
            if (!subopt.order) {
                var subOrder = ctx.to(optask.subTaskOrder);
                if (!_.isNumber(subOrder) && subOrder) {
                    optask.order = optask.order || subOrder.runWay;
                }
                else if (optask.subTaskRunWay) {
                    subopt.order = { runWay: optask.subTaskRunWay };
                }
            }
            subopt.name = ctx.subTaskName(subopt.name);
            return subopt;
        });
        this.buildContext(subtasks, ctx);
    };
    return Development;
}(Context_1.Context));
exports.Development = Development;

//# sourceMappingURL=sourcemaps/Development.js.map
