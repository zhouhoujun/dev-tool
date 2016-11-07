"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
var _ = require('lodash');
var minimist = require('minimist');
var LoaderFactory_1 = require('./LoaderFactory');
var development_core_1 = require('development-core');
var chalk = require('chalk');
// export * from 'development-core';
__export(require('./LoaderFactory'));
__export(require('./loaders/BaseLoader'));

var Development = function () {
    function Development(dirname, option) {
        _classCallCheck(this, Development);

        this.dirname = dirname;
        this.option = option;
        /**
         * global data.
         *
         *
         * @private
         * @type {*}
         * @memberOf Development
         */
        this.globals = {};
    }
    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} dirname
     * @param {(DevelopConfig | ITaskOption[])} setting
     * @returns {Development}
     *
     * @memberOf Development
     */


    _createClass(Development, [{
        key: 'run',
        value: function run(gulp, env) {
            if (!env.root) {
                env.root = this.dirname;
            }
            if (env.help) {
                console.log(chalk.grey('... main help  ...'));
                this.printHelp(env.help);
            }
            return this.loadTasks(gulp, this.option.tasks, env).then(function (tseq) {
                console.log(chalk.grey('run sequenec tasks:'), tseq);
                return development_core_1.runSequence(gulp, tseq);
            }).catch(function (err) {
                console.error(err);
                process.exit(1);
            });
        }
    }, {
        key: 'bindingConfig',
        value: function bindingConfig(cfg) {
            // cfg.env = cfg.env || this.env;
            cfg.globals = this.globals;
            return cfg;
        }
    }, {
        key: 'loadTasks',
        value: function loadTasks(gulp, tasks, env) {
            var _this = this;

            return Promise.all(_.map(_.isArray(tasks) ? tasks : [tasks], function (optask) {
                optask.dist = optask.dist || 'dist';
                console.log(chalk.grey('begin load task via loader:'), optask.loader);
                var loader = _this.createLoader(optask);
                return loader.loadConfg(env).then(function (cfg) {
                    console.log(chalk.green('task config loaded.'));
                    if (cfg.env.help) {
                        if (cfg.printHelp) {
                            console.log(chalk.grey('...development default help...'));
                            cfg.printHelp(_.isString(cfg.env.help) ? cfg.env.help : '');
                        }
                        return [];
                    } else {
                        cfg = _this.bindingConfig(cfg);
                        return _this.loadSubTask(gulp, cfg).then(function (subtask) {
                            return Promise.all([loader.load(cfg), _this.loadAssertTasks(gulp, cfg)]).then(function (tasks) {
                                console.log(chalk.green('tasks loaded.'));
                                return _this.setup(gulp, cfg, tasks[0], tasks[1], subtask);
                            });
                        });
                    }
                });
            })).then(function (tsq) {
                return _.flatten(tsq);
            });
        }
    }, {
        key: 'setup',
        value: function setup(gulp, config, tasks, assertsTask, subGroupTask) {
            return Promise.resolve(development_core_1.toSequence(gulp, tasks, config)).then(function (tsqs) {
                // if (_.isFunction(config.option['runTasks'])) {
                //     return config.option['runTasks'](config.oper, tsqs, subGroupTask, assertsTask);
                // } else if (_.isArray(config.option['runTasks'])) {
                //     tsqs = config.option['runTasks'];
                // } else 
                if (config.runTasks) {
                    return config.runTasks(tsqs, assertsTask, subGroupTask);
                }
                console.log(assertsTask);
                config.addToSequence(tsqs, assertsTask);
                config.addToSequence(tsqs, subGroupTask);
                return tsqs;
            });
        }
        /**
         * load sub tasks as group task.
         *
         * @protected
         * @param {Gulp} gulp
         * @param {ITaskConfig} config
         * @returns {Promise<Src>}
         *
         * @memberOf Development
         */

    }, {
        key: 'loadSubTask',
        value: function loadSubTask(gulp, config) {
            var _this2 = this;

            if (config['tasks']) {
                var _ret = function () {
                    var optask = config.option;
                    _.each(_.isArray(optask.tasks) ? optask.tasks : [optask.tasks], function (subopt) {
                        subopt.name = config.subTaskName(subopt.name);
                        subopt.src = subopt.src || optask.src;
                        subopt.dist = subopt.dist || optask.dist;
                    });
                    return {
                        v: _this2.loadTasks(gulp, optask.tasks, config.env).then(function (subseq) {
                            if (subseq && subseq.length > 0) {
                                var first = _.first(subseq);
                                var last = _.last(subseq);
                                var frn = _.isArray(first) ? _.first(first) : first;
                                var lsn = _.isArray(last) ? _.last(last) : last;
                                var subName = config.subTaskName(frn + '-' + lsn, '-sub');
                                gulp.task(subName, function () {
                                    return development_core_1.runSequence(gulp, subseq);
                                });
                                return {
                                    order: optask.subTaskOrder,
                                    taskName: subName
                                };
                            } else {
                                return null;
                            }
                        })
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } else {
                return Promise.resolve(null);
            }
        }
        /**
         * load asserts tasks.
         *
         * @protected
         * @param {Gulp} gulp
         * @param {ITaskConfig} config
         * @returns {Promise<Src>}
         *
         * @memberOf Development
         */

    }, {
        key: 'loadAssertTasks',
        value: function loadAssertTasks(gulp, config) {
            var _this3 = this;

            var optask = config.option;
            if (config.option.asserts) {
                var _ret2 = function () {
                    var tasks = [];
                    _.each(_.keys(optask.asserts), function (name) {
                        var op = void 0;
                        var aop = optask.asserts[name];
                        if (_.isString(aop)) {
                            op = { src: aop, loader: [{ name: name, pipes: [] }, { name: name + '-watch', watchTasks: [name] }] };
                        } else if (_.isArray(aop)) {
                            if (_.some(aop, function (it) {
                                return _.isString(aop);
                            })) {
                                op = { src: aop, loader: [{ name: name, pipes: [] }, { name: name + '-watch', watchTasks: [name] }] };
                            } else {
                                op = { loader: aop };
                            }
                        } else if (_.isFunction(aop)) {
                            op = { loader: aop };
                        } else {
                            op = aop;
                        }
                        ;
                        if (_.isNull(op) || _.isUndefined(op)) {
                            return;
                        }
                        op.name = config.subTaskName(name, '-assert');
                        op.src = op.src || config.getSrc() + '/**/*.' + name;
                        op.dist = op.dist || config.getDist();
                        tasks.push(op);
                    });
                    return {
                        v: Promise.all(_.map(tasks, function (task) {
                            return _this3.loadTasks(gulp, task, config.env).then(function (sq) {
                                return {
                                    task: task,
                                    sq: sq
                                };
                            });
                        })).then(function (tseq) {
                            // asserts tasks run mutil.
                            var assertSeq = _.map(tseq, function (t) {
                                var subseq = t.sq;
                                var name = void 0;
                                if (subseq && subseq.length > 0) {
                                    if (subseq.length === 1) {
                                        return subseq[0];
                                    }
                                    name = config.subTaskName(t.task);
                                    gulp.task(name, function () {
                                        return development_core_1.runSequence(gulp, subseq);
                                    });
                                } else {
                                    name = config.subTaskName(t.sq);
                                }
                                return name;
                            });
                            return {
                                order: config.option.assertsOrder,
                                taskName: assertSeq
                            };
                        })
                    };
                }();

                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
            } else {
                return Promise.resolve(null);
            }
        }
    }, {
        key: 'createLoader',
        value: function createLoader(option) {
            var _this4 = this;

            var loader = null;
            if (!_.isFunction(this.option.loaderFactory)) {
                (function () {
                    var factory = new LoaderFactory_1.LoaderFactory();
                    _this4.option.loaderFactory = function (opt) {
                        return factory.create(opt);
                    };
                })();
            }
            loader = this.option.loaderFactory(option);
            return loader;
        }
    }, {
        key: 'printHelp',
        value: function printHelp(help) {
            if (help === 'en') {
                console.log('\n                /**\n                 * gulp [build] [--env production|development] [--config name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env  development or production;\n                 *  --config app setting\n                 *  --root path, set relative path of the development tool root.\n                 *  --watch  watch src file change or not. if changed will auto update to node service. \n                 *  --release release web app or not. if [--env production], default to release. \n                 *  --test  need auto load test file to node service.\n                 *  --deploy run deploy tasks to deploy project.  \n                 *  --serve start node web service or not.\n                 *  --task taskname  spruce task taskname\n                 **/');
            } else {
                console.log('\n                /**\n                 * gulp [build] [--env production|development] [--config name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]\n                 * @params\n                 *  --env \u53D1\u5E03\u73AF\u5883 \u9ED8\u8BA4\u5F00\u53D1\u73AF\u5883development;\n                 *  --config \u8BBE\u7F6E\u914D\u7F6E\u6587\u4EF6;\n                 *  --root path, \u8BBE\u7F6E\u7F16\u8BD1\u73AF\u5883\u76F8\u5BF9\u8DEF\u5F84\n                 *  --watch  \u662F\u5426\u9700\u8981\u52A8\u6001\u76D1\u542C\u6587\u4EF6\u53D8\u5316\n                 *  --release \u662F\u5426release\u7F16\u8BD1, [--env production] \u9ED8\u8BA4release \n                 *  --test  \u542F\u52A8\u81EA\u52A8\u5316\u6D4B\u8BD5\n                 *  --deploy \u8FD0\u884C\u52A0\u8F7Ddeploy tasks, \u7F16\u8BD1\u53D1\u5E03\u9879\u76EE\u3002  \n                 *  --serve  \u662F\u5426\u5728\u5F00\u53D1\u6A21\u5F0F\u4E0B \u5F00\u542Fnode web\u670D\u52A1\n                 *  --task taskname  \u8FD0\u884C\u5355\u72EC\u4EFB\u52A1taskname\n                 **/');
            }
        }
    }], [{
        key: 'create',
        value: function create(gulp, dirname, setting) {
            var option = _.isArray(setting) ? { tasks: setting } : setting;
            var devtool = new Development(dirname, option);
            option.setupTask = option.setupTask || 'build';
            gulp.task(option.setupTask, function (callback) {
                var options = minimist(process.argv.slice(2), {
                    string: 'env',
                    default: { env: process.env.NODE_ENV || 'development' }
                });
                return devtool.run(gulp, options);
            });
            gulp.task('default', function () {
                gulp.start(option.setupTask);
            });
            return devtool;
        }
    }]);

    return Development;
}();

exports.Development = Development;
//# sourceMappingURL=sourcemaps/tools.js.map
