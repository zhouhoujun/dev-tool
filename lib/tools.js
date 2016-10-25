"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const _ = require('lodash');
const fs_1 = require('fs');
const minimist = require('minimist');
const LoaderFactory_1 = require('./LoaderFactory');
const TaskConfig_1 = require('./TaskConfig');
const chalk = require('chalk');
__export(require('./TaskConfig'));
__export(require('./LoaderFactory'));
__export(require('./loaders/BaseLoader'));
class Development {
    constructor(dirname, option) {
        this.dirname = dirname;
        this.option = option;
        this.globals = {};
    }
    static create(gulp, dirname, option) {
        let devtool = new Development(dirname, option);
        gulp.task('build', (callback) => {
            var options = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development' }
            });
            return devtool.run(gulp, options);
        });
        gulp.task('default', () => {
            gulp.start('build');
        });
        return devtool;
    }
    run(gulp, env) {
        if (!env.root) {
            env.root = this.dirname;
        }
        if (env.help) {
            console.log(chalk.grey('... main help  ...'));
            this.printHelp(env.help);
        }
        return this.loadTasks(gulp, this.option.tasks, env)
            .then(tseq => {
            console.log(chalk.grey('run sequenec tasks:'), tseq);
            return this.runSequence(gulp, tseq);
        })
            .catch(err => {
            console.error(err);
        });
    }
    bindingConfig(cfg) {
        cfg.globals = this.globals;
        cfg.fileFilter = cfg.fileFilter || files;
        cfg.runSequence = cfg.runSequence || runSequence;
        cfg.dynamicTasks = cfg.dynamicTasks || ((tasks) => {
            return dynamicTask(tasks, cfg.oper, cfg.env);
        });
        cfg.getDist = cfg.getDist || ((asserts) => {
            asserts = asserts || cfg.option;
            let dist;
            switch (cfg.oper) {
                case TaskConfig_1.Operation.build:
                    dist = asserts.build || asserts.dist;
                    break;
                case TaskConfig_1.Operation.test:
                    dist = asserts.test || asserts.build || asserts.dist;
                    break;
                case TaskConfig_1.Operation.e2e:
                    dist = asserts.e2e || asserts.build || asserts.dist;
                    break;
                case TaskConfig_1.Operation.release:
                    dist = asserts.release || asserts.dist;
                    break;
                case TaskConfig_1.Operation.deploy:
                    dist = asserts.deploy || asserts.dist;
                    break;
                default:
                    dist = '';
                    break;
            }
            return dist;
        });
        return cfg;
    }
    runSequence(gulp, tasks) {
        return runSequence(gulp, tasks);
    }
    toSquence(tasks, oper) {
        let seq = [];
        _.each(tasks, t => {
            if (!t) {
                return;
            }
            if (_.isString(t)) {
                seq.push(t);
            }
            else if (_.isArray(t)) {
                seq.push(_.flatten(this.toSquence(t, oper)));
            }
            else {
                if (t.name) {
                    if (t.oper && ((t.oper & oper) > 0)) {
                        seq.push(t.name);
                    }
                }
            }
        });
        return seq;
    }
    loadTasks(gulp, tasks, env) {
        return Promise.all(_.map(_.isArray(tasks) ? tasks : [tasks], optask => {
            optask.dist = optask.dist || 'dist';
            let oper;
            if (env.deploy) {
                oper = TaskConfig_1.Operation.deploy;
            }
            else if (env.release) {
                oper = TaskConfig_1.Operation.release;
            }
            else if (env.e2e) {
                oper = TaskConfig_1.Operation.e2e;
            }
            else if (env.test) {
                oper = TaskConfig_1.Operation.test;
            }
            else {
                oper = TaskConfig_1.Operation.build;
            }
            console.log(chalk.grey('begin load task via loader:'), optask.loader);
            let loader = this.createLoader(optask);
            return loader.loadConfg(oper, env)
                .then(cfg => {
                console.log(chalk.green('task config loaded.'));
                if (cfg.env.help) {
                    if (cfg.printHelp) {
                        console.log(chalk.grey('...development default help...'));
                        cfg.printHelp(_.isString(cfg.env.help) ? cfg.env.help : '');
                    }
                    return [];
                }
                else {
                    cfg = this.bindingConfig(cfg);
                    return this.loadSubTask(gulp, cfg)
                        .then(subtask => {
                        return Promise.all([
                            loader.load(cfg),
                            this.loadAssertTasks(gulp, cfg)
                        ])
                            .then(tasks => {
                            console.log(chalk.green('tasks loaded.'));
                            return this.setup(gulp, cfg, tasks[0], tasks[1], subtask);
                        });
                    });
                }
            });
        })).then(tsq => {
            return _.flatten(tsq);
        });
    }
    setup(gulp, config, tasks, assertsTask, subGroupTask) {
        return Promise.all(_.map(tasks, t => {
            return t(gulp, config);
        }))
            .then(ts => {
            let tsqs = this.toSquence(ts, config.oper);
            if (_.isFunction(config.option.runTasks)) {
                return config.option.runTasks(config.oper, tsqs, subGroupTask, assertsTask);
            }
            else if (_.isArray(config.option.runTasks)) {
                tsqs = config.option.runTasks;
            }
            else if (config.runTasks) {
                return config.runTasks(subGroupTask, tsqs, assertsTask);
            }
            assertsTask && tsqs.splice(0, 0, assertsTask);
            subGroupTask && tsqs.splice(0, 0, subGroupTask);
            return tsqs;
        });
    }
    loadSubTask(gulp, config) {
        let optask = config.option;
        if (optask.tasks) {
            _.each(_.isArray(optask.tasks) ? optask.tasks : [optask.tasks], subopt => {
                subopt.src = subopt.src || optask.src;
                subopt.dist = subopt.dist || optask.dist;
            });
            return this.loadTasks(gulp, optask.tasks, config.env)
                .then(subseq => {
                if (subseq && subseq.length > 0) {
                    let first = _.first(subseq);
                    let last = _.last(subseq);
                    let frn = _.isArray(first) ? _.first(first) : first;
                    let lsn = _.isArray(last) ? _.last(last) : last;
                    let subName = `${config.option.name ? config.option.name + '_' : ''}${frn}_${lsn}`;
                    gulp.task(subName, () => {
                        return runSequence(gulp, subseq);
                    });
                    return subName;
                }
                else {
                    return null;
                }
            });
        }
        else {
            return Promise.resolve(null);
        }
    }
    loadAssertTasks(gulp, config) {
        let optask = config.option;
        if (optask.asserts) {
            let tasks = _.map(_.keys(optask.asserts), name => {
                let op;
                let aop = optask.asserts[name];
                if (_.isString(aop) || _.isArray(aop)) {
                    op = { src: aop, loader: [{ name: name, pipes: [] }] };
                }
                else {
                    op = aop;
                }
                ;
                optask.name = name;
                op.src = op.src || (optask.src + '/**/*.' + name);
                op.dist = op.dist || optask.dist;
                return op;
            });
            return Promise.all(_.map(tasks, task => {
                return this.loadTasks(gulp, task, config.env)
                    .then(sq => {
                    return {
                        task: task,
                        sq: sq
                    };
                });
            }))
                .then(tseq => {
                return _.map(tseq, t => {
                    let subseq = t.sq;
                    if (subseq && subseq.length > 0) {
                        gulp.task(t.task.name, () => {
                            return runSequence(gulp, subseq);
                        });
                        return t.task.name;
                    }
                    return t.sq;
                });
            });
        }
        else {
            return Promise.resolve(null);
        }
    }
    createLoader(option) {
        let loader = null;
        if (!_.isFunction(this.option.loaderFactory)) {
            let factory = new LoaderFactory_1.LoaderFactory();
            this.option.loaderFactory = (opt) => {
                return factory.create(opt);
            };
        }
        loader = this.option.loaderFactory(option);
        return loader;
    }
    printHelp(help) {
        if (help === 'en') {
            console.log(`
                /**
                 * gulp [build] [--env production|development] [--config name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]
                 * @params
                 *  --env  development or production;
                 *  --config app setting
                 *  --root path, set relative path of the development tool root.
                 *  --watch  watch src file change or not. if changed will auto update to node service. 
                 *  --release release web app or not. if [--env production], default to release. 
                 *  --test  need auto load test file to node service.
                 *  --deploy run deploy tasks to deploy project.  
                 *  --serve start node web service or not.
                 *  --task taskname  spruce task taskname
                 **/`);
        }
        else {
            console.log(`
                /**
                 * gulp [build] [--env production|development] [--config name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]
                 * @params
                 *  --env 发布环境 默认开发环境development;
                 *  --config 设置配置文件;
                 *  --root path, 设置编译环境相对路径
                 *  --watch  是否需要动态监听文件变化
                 *  --release 是否release编译, [--env production] 默认release 
                 *  --test  启动自动化测试
                 *  --deploy 运行加载deploy tasks, 编译发布项目。  
                 *  --serve  是否在开发模式下 开启node web服务
                 *  --task taskname  运行单独任务taskname
                 **/`);
        }
    }
}
exports.Development = Development;
function runSequence(gulp, tasks) {
    let ps = Promise.resolve();
    if (tasks && tasks.length > 0) {
        _.each(tasks, task => {
            ps = ps.then(() => {
                let taskErr = null, taskStop = null;
                return new Promise((reslove, reject) => {
                    let tskmap = {};
                    _.each(_.isArray(task) ? task : [task], t => {
                        tskmap[t] = false;
                    });
                    taskErr = (err) => {
                        reject(err);
                    };
                    taskStop = (e) => {
                        tskmap[e.task] = true;
                        if (!_.some(_.values(tskmap), it => !it)) {
                            reslove();
                        }
                    };
                    gulp.on('task_stop', taskStop)
                        .on('task_err', taskErr);
                    gulp.start(task);
                })
                    .then(() => {
                    if (gulp['removeListener']) {
                        gulp['removeListener']('task_stop', taskStop);
                        gulp['removeListener']('task_err', taskErr);
                    }
                })
                    .catch(err => {
                    if (gulp['removeListener']) {
                        gulp['removeListener']('task_stop', taskStop);
                        gulp['removeListener']('task_err', taskErr);
                    }
                    console.error(err);
                });
            });
        });
    }
    return ps;
}
exports.runSequence = runSequence;
function files(directory, express) {
    let res = [];
    express = express || ((fn) => true);
    _.each(fs_1.readdirSync(directory), fname => {
        let filePn = directory + '/' + fname;
        var fst = fs_1.lstatSync(filePn);
        if (!fst.isDirectory()) {
            if (express(filePn)) {
                res.push(filePn);
            }
        }
        else {
            res = res.concat(files(filePn, express));
        }
    });
    return res;
}
exports.files = files;
function createWatchTask(dt) {
    return (gulp, cfg) => {
        if (!_.isFunction(_.last(dt.watch))) {
            dt.watch.push((event) => {
                dt.watchChanged && dt.watchChanged(event, cfg);
            });
        }
        gulp.task(dt.name, () => {
            console.log('watch, src:', chalk.cyan.call(chalk, cfg.option.src), ' , watch task:', chalk.cyan.call(chalk, dt.watch));
            gulp.watch(cfg.option.src, dt.watch);
        });
        return dt.name;
    };
}
function createTask(dt) {
    return (gulp, cfg) => {
        gulp.task(dt.name, (callback) => {
            return createTaskWork(gulp, cfg, dt);
        });
        return dt.name;
    };
}
function createTaskWork(gulp, cfg, dt) {
    let src = Promise.resolve(gulp.src(cfg.option.src));
    if (dt.pipes) {
        _.each(dt.pipes, (p) => {
            src = src.then(psrc => {
                return Promise.resolve((_.isFunction(p) ? p(cfg) : p))
                    .then(stram => {
                    return psrc.pipe(stram);
                });
            });
        });
    }
    else if (dt.pipe) {
        src = src.then((src => {
            return dt.pipe(src, cfg);
        }));
    }
    src.then(stream => {
        if (dt.output) {
            return Promise.all(_.map(_.isArray(dt.output) ? dt.output : [dt.output], output => {
                return new Promise((resolve, reject) => {
                    Promise.resolve((_.isFunction(output) ? output(stream, cfg) : output))
                        .then(output => {
                        stream.pipe(output)
                            .once('end', resolve)
                            .once('error', reject);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }));
        }
        else {
            return new Promise((resolve, reject) => {
                stream.pipe(gulp.dest(cfg.getDist(cfg.option)))
                    .once('end', resolve)
                    .once('error', reject);
            });
        }
    });
    return src.catch(err => {
        console.log(chalk.red(err));
    });
}
function dynamicTask(tasks, oper, env) {
    let taskseq = [];
    _.each(_.isArray(tasks) ? tasks : [tasks], dt => {
        if (dt.oper && (dt.oper & oper) <= 0) {
            return;
        }
        if (dt.watch) {
            if (!env.watch) {
                return;
            }
            console.log('register watch  dynamic task:', chalk.cyan(dt.name));
            taskseq.push(createWatchTask(dt));
        }
        else if (_.isFunction(dt.task)) {
            console.log('register custom dynamic task:', chalk.cyan(dt.name));
            taskseq.push((gulp, cfg) => {
                gulp.task(dt.name, () => {
                    dt.task(cfg, gulp);
                });
                return dt.name;
            });
        }
        else {
            console.log('register pipes  dynamic task:', chalk.cyan(dt.name));
            taskseq.push(createTask(dt));
        }
    });
    return taskseq;
}
exports.dynamicTask = dynamicTask;

//# sourceMappingURL=sourcemaps/tools.js.map
