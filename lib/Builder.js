"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var development_core_1 = require("development-core");
var _ = require("lodash");
var Context_1 = require("./Context");
var ContextBuilder = (function () {
    function ContextBuilder() {
    }
    /**
     * build context component.
     *
     * @protected
     * @memberof Development
     */
    ContextBuilder.prototype.build = function (node, option) {
        option ? this.buildContexts(node, option) : this.buildContext(node);
        node['__built'] = true;
        return node;
    };
    /**
     * is built or not.
     *
     * @param {ITaskContext} node
     * @returns {boolean}
     * @memberof ContextBuilder
     */
    ContextBuilder.prototype.isBuilt = function (node) {
        return node && node['__built'];
    };
    ContextBuilder.prototype.clean = function (node) {
        if (node) {
            node['__built'] = undefined;
        }
    };
    ContextBuilder.prototype.buildContext = function (node) {
        var optask = node.option;
        if (optask.asserts) {
            var assertctx = Context_1.createConextInstance(_.extend({ name: 'asserts', loader: [], order: optask.assertsOrder }), node);
            var asserts = optask.asserts;
            optask.asserts = null;
            this.buildAssertContext(assertctx, asserts, optask.assertsRunWay);
        }
        if (optask.tasks) {
            this.buildSubContext(node);
        }
    };
    ContextBuilder.prototype.buildContexts = function (parent, taskOptions) {
        var _this = this;
        var tasks = _.isArray(taskOptions) ? taskOptions : [taskOptions];
        tasks.forEach(function (optask) {
            if (optask.oper && parent.oper && (parent.oper & optask.oper) <= 0) {
                return;
            }
            var ctx = Context_1.createConextInstance(optask, parent);
            if (optask.asserts) {
                var assertctx = Context_1.createConextInstance(_.extend({ name: 'asserts', loader: [], order: optask.assertsOrder }), ctx);
                var asserts = optask.asserts;
                optask.asserts = null;
                _this.buildAssertContext(assertctx, asserts, optask.assertsRunWay);
            }
            if (optask.tasks) {
                _this.buildSubContext(ctx);
            }
        });
    };
    /**
        * build asserts tasks.
        *
        * @protected
        * @param {ITaskContext} ctx
        *
        * @memberOf Builder
        */
    ContextBuilder.prototype.buildAssertContext = function (ctx, asserts, runWay) {
        var tasks = [];
        _.each(_.keys(asserts), function (name) {
            var op;
            var sr = asserts[name];
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
            op.runWay = op.runWay || runWay || development_core_1.RunWay.parallel;
            tasks.push(op);
        });
        this.buildContexts(ctx, tasks);
        // this.creatContext(tasks, ctx);
    };
    /**
     * build sub context.
     *
     * @protected
     * @param {IContext} ctx
     *
     * @memberOf Builder
     */
    ContextBuilder.prototype.buildSubContext = function (ctx) {
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
        this.buildContexts(ctx, subtasks);
    };
    return ContextBuilder;
}());
exports.ContextBuilder = ContextBuilder;

//# sourceMappingURL=sourcemaps/Builder.js.map
