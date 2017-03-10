"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var minimist = require("minimist");
var loaderFactory_1 = require("./loaderFactory");
var development_core_1 = require("development-core");
var Context_1 = require("./Context");
var chalk = require("chalk");
var events_1 = require("events");
var Development = (function (_super) {
    __extends(Development, _super);
    /**
     * Creates an instance of Development.
     *
     * @param {string} dirname
     * @param {DevelopConfig} config
     *
     * @memberOf Development
     */
    function Development(dirname, config) {
        var _this = _super.call(this) || this;
        _this.dirname = dirname;
        _this.config = config;
        if (config.evnets) {
            _.each(_.keys(config.evnets), function (key) {
                _this.on(key, config.evnets[key]);
            });
        }
        return _this;
    }
    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} dirname
     * @param {(DevelopConfig | Array<ITaskOption | IAssertOption | IDynamicTaskOption>)} setting
     * @param {any} [runWay=RunWay.sequence]
     * @returns {Development}
     *
     * @memberOf Development
     */
    Development.create = function (gulp, dirname, setting, runWay, factory) {
        if (runWay === void 0) { runWay = development_core_1.RunWay.sequence; }
        var option = _.isArray(setting) ? { tasks: setting, runWay: runWay } : setting;
        if (!_.isUndefined(option.runWay)) {
            option.runWay = runWay;
        }
        option.contextFactory = factory || (function (cfg, parent) {
            var ctx = new Context_1.Context(cfg, parent);
            if (parent && parent.add) {
                parent.add(ctx);
            }
            return ctx;
        });
        var devtool = new Development(dirname, option);
        devtool.setup(gulp);
        return devtool;
    };
    /**
     * run task.
     *
     * @param {Gulp} gulp
     * @param {IEnvOption} env
     * @returns {Promise<any>}
     *
     * @memberOf Development
     */
    Development.prototype.run = function (gulp, env) {
        var _this = this;
        return this.setupTasks(gulp, env)
            .then(function (seq) {
            var tseq = env.task ? env.task.split(',') : seq;
            var gbctx = _this.getContext(env);
            _this.emit('beforRun', tseq, gbctx);
            if (_this.config.runWay === development_core_1.RunWay.parallel) {
                return development_core_1.runSequence(gulp, [development_core_1.flattenSequence(gulp, tseq, gbctx)]);
            }
            else {
                return development_core_1.runSequence(gulp, tseq);
            }
        })
            .then(function () {
            var gbctx = _this.getContext(env);
            _this.emit('afterRun', gbctx);
        })
            .catch(function (err) {
            console.error(err);
            process.exit(1);
        });
    };
    Development.prototype.setupTasks = function (gulp, env) {
        var _this = this;
        if (!env.root) {
            env.root = this.dirname;
        }
        if (env.help) {
            console.log(chalk.grey('... main help  ...'));
            this.printHelp(env.help);
        }
        var gbctx = this.getContext(env);
        this.emit('beforSetup', gbctx);
        return this.loadTasks(gulp, this.config.tasks, gbctx)
            .then(function (tsq) {
            _this.emit('afterSetup', tsq, gbctx);
            return tsq;
        })
            .catch(function (err) {
            console.error(err);
            process.exit(1);
        });
    };
    Development.prototype.setup = function (gulp) {
        var _this = this;
        var config = this.config;
        config.setupTask = config.setupTask || 'build';
        gulp.task(config.setupTask, function (callback) {
            var options = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development' }
            });
            return _this.run(gulp, options);
        });
        config.startTask = config.startTask || 'start';
        gulp.task(config.startTask, function (callback) {
            var options = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development' }
            });
            if (!options.task) {
                return Promise.reject('start task can not empty!');
            }
            return _this.run(gulp, options);
        });
        gulp.task('default', function () {
            gulp.start(config.setupTask);
        });
    };
    Development.prototype.getContext = function (env) {
        if (!this.globalctx || this.globalctx.env !== env) {
            var option = this.config.option || {};
            this.globalctx = this.config.contextFactory({
                env: env,
                option: option
            });
        }
        return this.globalctx;
    };
    Development.prototype.loadTasks = function (gulp, tasks, parent) {
        var _this = this;
        return Promise.all(_.map(_.isArray(tasks) ? tasks : [tasks], function (optask) {
            // optask.dist = optask.dist || 'dist';
            // console.log(chalk.grey('begin load task via loader:'), optask.loader);
            var loader = _this.createLoader(optask, parent);
            return loader.loadContext(parent.env)
                .then(function (ctx) {
                console.log(chalk.green('task context loaded.'));
                if (ctx.env.help) {
                    if (ctx.printHelp) {
                        console.log(chalk.grey('...development default help...'));
                        ctx.printHelp(_.isString(ctx.env.help) ? ctx.env.help : '');
                    }
                    return [];
                }
                else {
                    return Promise.all([
                        loader.load(ctx),
                        _this.loadAssertTasks(gulp, ctx),
                        _this.loadSubTask(gulp, ctx)
                    ])
                        .then(function (tks) {
                        console.log(chalk.green('tasks loaded.'));
                        return _this.setupTask(gulp, ctx, tks[0], tks[1], tks[2]);
                    });
                }
            });
        }))
            .then(function (tsq) {
            var rst = [];
            _.each(tsq, function (t) {
                var tk = development_core_1.zipSequence(gulp, t, parent);
                if (tk) {
                    rst.push(tk);
                }
            });
            return rst;
        });
    };
    Development.prototype.setupTask = function (gulp, ctx, tasks, assertsTask, subGroupTask) {
        return Promise.resolve(development_core_1.toSequence(gulp, tasks, ctx))
            .then(function (tsqs) {
            if (ctx.runTasks) {
                return ctx.runTasks(tsqs, assertsTask, subGroupTask);
            }
            // console.log(assertsTask);
            ctx.addToSequence(tsqs, assertsTask);
            ctx.addToSequence(tsqs, subGroupTask);
            return tsqs;
        });
    };
    /**
     * load sub tasks as group task.
     *
     * @protected
     * @param {Gulp} gulp
     * @param {IContext} ctx
     * @returns {Promise<ITaskInfo>}
     *
     * @memberOf Development
     */
    Development.prototype.loadSubTask = function (gulp, ctx) {
        if (ctx.option['tasks']) {
            var optask_1 = ctx.option;
            _.each(_.isArray(optask_1.tasks) ? optask_1.tasks : [optask_1.tasks], function (subopt) {
                subopt.name = ctx.subTaskName(subopt.name);
                // subopt.src = subopt.src || optask.src;
                // subopt.dist = subopt.dist || optask.dist;
            });
            return this.loadTasks(gulp, optask_1.tasks, ctx)
                .then(function (subseq) {
                var taskname;
                if (optask_1.subTaskRunWay === development_core_1.RunWay.parallel) {
                    taskname = [development_core_1.flattenSequence(gulp, subseq, ctx, function (name, runway) { return ctx.subTaskName(name, (runway === development_core_1.RunWay.sequence ? '-subs' : '-subp')); })];
                }
                else {
                    taskname = development_core_1.zipSequence(gulp, subseq, ctx, function (name, runway) { return ctx.subTaskName(name, (runway === development_core_1.RunWay.sequence ? '-subs' : '-subp')); });
                }
                if (taskname) {
                    return {
                        order: optask_1.subTaskOrder,
                        taskName: taskname
                    };
                }
                else {
                    return null;
                }
            });
        }
        else {
            return Promise.resolve(null);
        }
    };
    /**
     * load asserts tasks.
     *
     * @protected
     * @param {Gulp} gulp
     * @param {ITaskContext} ctx
     * @returns {Promise<Src>}
     *
     * @memberOf Development
     */
    Development.prototype.loadAssertTasks = function (gulp, ctx) {
        var _this = this;
        var optask = ctx.option;
        if (optask.asserts) {
            var tasks_1 = [];
            _.each(_.keys(optask.asserts), function (name) {
                var op;
                var sr = optask.asserts[name];
                if (_.isString(sr)) {
                    op = { src: sr, loader: [{ name: name, pipes: [], watch: true }] };
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
                        if (_.isString(_.first(sr))) {
                            op = { src: sr, loader: [{ name: name, pipes: [], watch: true }] };
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
                op.name = op.name || ctx.subTaskName(name);
                op.src = op.src || (ctx.getSrc({ oper: development_core_1.Operation.build }) + '/**/*.' + name);
                // op.dist = op.dist || ctx.getDist({ oper: Operation.build });
                tasks_1.push(op);
            });
            return Promise.all(_.map(tasks_1, function (task) {
                return _this.loadTasks(gulp, task, ctx)
                    .then(function (sq) {
                    return {
                        task: task,
                        sq: sq
                    };
                });
            }))
                .then(function (tseq) {
                // asserts tasks run mutil.
                var assertSeq = _.map(tseq, function (t) {
                    return development_core_1.zipSequence(gulp, t.sq, ctx, function (name, runway) { return ctx.subTaskName(t.task.name, runway === development_core_1.RunWay.sequence ? '-asserts' : '-assertp'); }); // ctx.subTaskName(name + (runway === RunWay.sequence ? '-assert-seq' : '-assert-par')));
                });
                var taskname;
                if (optask.assertsRunWay === development_core_1.RunWay.sequence) {
                    taskname = assertSeq;
                }
                else {
                    taskname = development_core_1.zipSequence(gulp, [assertSeq], ctx, function (name, runway) { return name + (runway === development_core_1.RunWay.sequence ? '-asserts' : '-assertp'); });
                }
                return {
                    order: optask.assertsOrder,
                    taskName: taskname
                };
            });
        }
        else {
            return Promise.resolve(null);
        }
    };
    Development.prototype.createLoader = function (option, parent) {
        var _this = this;
        if (!_.isFunction(this.config.loaderFactory)) {
            var factory = new loaderFactory_1.LoaderFactory();
            return factory.create(option, parent.env, function (cfg, p) {
                return _this.config.contextFactory(cfg, p || parent);
            });
        }
        else {
            return this.config.loaderFactory(option, parent.env);
        }
    };
    Development.prototype.printHelp = function (help) {
        if (help === 'en') {
            console.log("\n                /**\n                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env  development or production;\n                 *  --context app setting\n                 *  --root path, set relative path of the development tool root.\n                 *  --watch  watch src file change or not. if changed will auto update to node service. \n                 *  --release release web app or not. if [--env production], default to release. \n                 *  --test  need auto load test file to node service.\n                 *  --deploy run deploy tasks to deploy project.  \n                 *  --serve start node web service or not.\n                 *  --task taskname  spruce task taskname\n                 **/");
        }
        else {
            console.log("\n                /**\n                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env \u53D1\u5E03\u73AF\u5883 \u9ED8\u8BA4\u5F00\u53D1\u73AF\u5883development;\n                 *  --context \u8BBE\u7F6E\u914D\u7F6E\u6587\u4EF6;\n                 *  --root path, \u8BBE\u7F6E\u7F16\u8BD1\u73AF\u5883\u76F8\u5BF9\u8DEF\u5F84\n                 *  --watch  \u662F\u5426\u9700\u8981\u52A8\u6001\u76D1\u542C\u6587\u4EF6\u53D8\u5316\n                 *  --release \u662F\u5426release\u7F16\u8BD1, [--env production] \u9ED8\u8BA4release \n                 *  --test  \u542F\u52A8\u81EA\u52A8\u5316\u6D4B\u8BD5\n                 *  --deploy \u8FD0\u884C\u52A0\u8F7Ddeploy tasks, \u7F16\u8BD1\u53D1\u5E03\u9879\u76EE\u3002  \n                 *  --serve  \u662F\u5426\u5728\u5F00\u53D1\u6A21\u5F0F\u4E0B \u5F00\u542Fnode web\u670D\u52A1\n                 *  --task taskname  \u8FD0\u884C\u5355\u72EC\u4EFB\u52A1taskname\n                 **/");
        }
    };
    return Development;
}(events_1.EventEmitter));
exports.Development = Development;

//# sourceMappingURL=sourcemaps/Development.js.map
