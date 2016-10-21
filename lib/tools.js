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
        gulp.task('default', ['build']);
        return devtool;
    }
    run(gulp, env) {
        if (!env.root) {
            env.root = this.dirname;
        }
        if (env.help) {
            console.log(chalk.grey('\n... main help  ...\n'));
            this.printHelp(env.help);
        }
        return this.loadTasks(gulp, this.option.tasks, env)
            .then(tseq => {
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
        return cfg;
    }
    runSequence(gulp, tasks) {
        return runSequence(gulp, tasks);
    }
    toSquence(tasks) {
        return _.filter(tasks, t => !!t);
    }
    loadTasks(gulp, tasks, env) {
        return Promise.all(_.map(_.isArray(tasks) ? tasks : [tasks], optask => {
            console.log(chalk.grey('begin load task via loader type:'), chalk.cyan(optask.loader.type || 'module'));
            let loader = this.createLoader(optask);
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
            return loader.loadConfg(oper, env)
                .then(cfg => {
                console.log(chalk.green('task config loaded.\n'));
                if (cfg.env.help) {
                    if (cfg.printHelp) {
                        console.log(chalk.grey('\n...development default help...\n'));
                        cfg.printHelp(_.isString(cfg.env.help) ? cfg.env.help : '');
                    }
                    return [];
                }
                else {
                    return loader.load(this.bindingConfig(cfg))
                        .then(tasks => {
                        console.log(chalk.green('tasks loaded.\n'));
                        return this.setup(gulp, cfg, tasks);
                    })
                        .then(tsq => {
                        if (optask.tasks) {
                            _.each(_.isArray(optask.tasks) ? optask.tasks : [optask.tasks], subopt => {
                                subopt.src = subopt.src || optask.src;
                                subopt.dist = subopt.dist || optask.dist;
                            });
                            return this.loadTasks(gulp, optask.tasks, env)
                                .then(subseq => {
                                if (subseq && subseq.length > 0) {
                                    let first = _.first(subseq);
                                    let last = _.last(subseq);
                                    let frn = _.isArray(first) ? _.first(first) : first;
                                    let lsn = _.isArray(last) ? _.first(last) : last;
                                    let subName = frn + '_' + lsn;
                                    gulp.task(subName, () => {
                                        return runSequence(gulp, subseq);
                                    });
                                    return tsq.push(subName);
                                }
                                else {
                                    return tsq;
                                }
                            });
                        }
                        else {
                            return tsq;
                        }
                    });
                }
            });
        })).then(tsq => {
            return _.flatten(tsq);
        });
    }
    setup(gulp, config, tasks) {
        return Promise.all(_.map(tasks, t => {
            return t(gulp, config);
        }))
            .then(ts => {
            let tsqs = config.runTasks ? config.runTasks() : this.toSquence(ts);
            console.log(chalk.grey('run sequenec tasks:'), tsqs);
            if (config.option.runTasks) {
                if (_.isArray(config.option.runTasks)) {
                    tsqs = config.option.runTasks;
                }
                else if (_.isFunction(config.option.runTasks)) {
                    tsqs = config.option.runTasks(config.oper, tsqs);
                }
            }
            return tsqs;
        });
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
                /**\n
                 * gulp build [--env production|development] [--config name] [--aspnet] [--root rootPath] [--watch] [--test] [--serve] [--release]\n
                 * @params\n
                 *  --env  development or production;\n
                 *  --config app setting, name is the words(src/config-*.json)*; default settings: test, produce, beijing; Or you can add youself setting config file at the path and named as "src/config-*.json" /\n
                 *  --root rootPath, set relative path of the app root\n
                 *  --aspnet to set build as aspnet service or not.\n
                 *  --watch  watch src file change or not. if changed will auto update to node service. \n
                 *  --release release web app or not. if [--env production], default to release. \n
                 *  --test  need auto load test file to node service.\n
                 *  --testdata load test data when release.  \n
                 *  --serve start node web service or not.\n
                 * \nn\
                 * gulp test  start node auto test. Before test you need start anthor commond to watch file changed, and must with "--test" to load test file.\nn\
                 * gulp language [--localspath language path][--lang en][--csv filepath][--key 0][--value 1]\n
                 *  auto check and update language config from csv file to json file.\n
                 **/\n`);
        }
        else {
            console.log(`
                /**\n
                 * gulp build 启动编译工具 [--env production|development] [--config name] [--aspnet] [--root rootPath] [--watch] [--test] [--serve] [--release]\n
                 * @params\n
                 *  --env 发布环境 默认开发环境development;\n
                 *  --config 设置配置文件， name为配置文件(src/config-*.json)中*的名字; 默认配置有test, produce, beijing; 可以手动添加自己要的配置，配置文件命名路径规则src/config-*.json /\n
                 *  --root rootPath, 设置前端APP相对站点路径\n
                 *  --aspnet 是否发布为 aspnet服务环境\n
                 *  --watch  是否需要动态监听文件变化\n
                 *  --release 是否release编译, [--env production] 默认release \n
                 *  --test  启动自动化测试\n
                 *  --testdata 是否release编译加载test data。  \n
                 *  --serve  是否在开发模式下 开启node web服务\n
                 * \nn\
                 * gulp tools  启动工具集合\nn\
                 * @params\n
                 *  --language [--localspath language path][--lang en][--csv filepath][--key 0][--value 1]\n 设置多语言\n
                 *  --publish 发布git npm
                 **/\n`);
        }
    }
}
exports.Development = Development;
function runSequence(gulp, tasks) {
    let ps = Promise.resolve();
    if (tasks && tasks.length > 0) {
        _.each(tasks, task => {
            ps = ps.then(() => {
                let taskErr = null, taskStop = null, len = _.isArray(task) ? (task.length - 1) : 0;
                return new Promise((reslove, reject) => {
                    taskErr = (err) => {
                        reject(err);
                    };
                    taskStop = (e) => {
                        if (len <= 0) {
                            reslove();
                        }
                        else {
                            if (task.indexOf(e.task) >= 0) {
                                len--;
                            }
                        }
                    };
                    gulp.on('task_stop', taskStop)
                        .on('task_err', taskErr);
                    gulp.start(task, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            reslove();
                        }
                    });
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
