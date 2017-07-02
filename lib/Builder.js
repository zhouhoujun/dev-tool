"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var development_core_1 = require("development-core");
var _ = require("lodash");
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
        var ctx = node;
        return option ? this.buildContexts(ctx, option) : this.buildContext(ctx);
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
    ContextBuilder.prototype.setBuilt = function (node) {
        if (node) {
            node['__built'] = true;
        }
    };
    ContextBuilder.prototype.buildContext = function (node) {
        var _this = this;
        return node.getLoader()
            .load()
            .then(function (tasks) {
            // this.setBuilt(node);
            var component = [];
            var optask = node.option;
            if (optask.asserts) {
                var assertctx = node.add({ name: 'asserts', loader: [], order: optask.assertsOrder });
                var asserts = optask.asserts;
                optask.asserts = null;
                component.push(_this.buildAssertContext(assertctx, asserts, optask.assertsRunWay));
            }
            if (optask.tasks) {
                component.push(_this.buildSubContext(node));
            }
            return Promise.all(component);
        })
            .then(function () {
            _this.setBuilt(node);
            return node;
        });
    };
    ContextBuilder.prototype.buildContexts = function (parent, taskOptions) {
        var _this = this;
        return parent.getLoader()
            .load()
            .then(function () {
            return _this.createContexts(parent, taskOptions);
        })
            .then(function () {
            _this.setBuilt(parent);
            return parent;
        });
    };
    ContextBuilder.prototype.createContexts = function (node, taskOptions) {
        var _this = this;
        var tasks = _.isArray(taskOptions) ? taskOptions : [taskOptions];
        return Promise.all(tasks.map(function (optask) {
            if (optask.oper && node.oper && (node.oper & optask.oper) <= 0) {
                return null;
            }
            var ctx = node.add(optask);
            return _this.buildContext(ctx);
        }));
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
            op.name = op.name || name; // || ctx.taskName(name);
            op.src = op.src || (ctx.getSrc({ oper: development_core_1.Operation.default }) + '/**/*.' + name);
            // op.dist = op.dist || ctx.getDist({ oper: Operation.build });
            op.runWay = op.runWay || runWay || development_core_1.RunWay.parallel;
            tasks.push(op);
        });
        return this.createContexts(ctx, tasks);
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
        if (!optask.tasks) {
            return null;
        }
        var tasks = _.isArray(optask.tasks) ? optask.tasks : [optask.tasks];
        // let idex = 0;
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
            subopt.name = subopt.name || ctx.taskName(subopt.name); // ('sub' + idex++);
            return subopt;
        });
        return this.createContexts(ctx, subtasks);
    };
    return ContextBuilder;
}());
exports.ContextBuilder = ContextBuilder;

//# sourceMappingURL=sourcemaps/Builder.js.map
