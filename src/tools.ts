import * as _ from 'lodash';
import { Gulp, WatchEvent, TaskCallback } from 'gulp';
import { readdirSync, lstatSync } from 'fs';
import * as minimist from 'minimist';
import { ITaskLoader } from './ITaskLoader';
import { LoaderFactory } from './LoaderFactory';
import { Src, Asserts, Task, TaskOption, Operation, EnvOption, DynamicTask, TaskResult, Pipe, TaskConfig } from './TaskConfig';
import { DevelopConfig } from './DevelopConfig';
import * as chalk from 'chalk';

export * from './DevelopConfig';
export * from './TaskConfig';
export * from './ITaskLoader';
export * from './LoaderFactory';
export * from './loaders/BaseLoader';

export class Development {
    /**
     * global data.
     * 
     * 
     * @private
     * @type {*}
     * @memberOf Development
     */
    private globals: any = {};
    static create(gulp: Gulp, dirname: string, option?: DevelopConfig): Development {
        let devtool = new Development(dirname, option);
        gulp.task('build', (callback: TaskCallback) => {
            var options: EnvOption = minimist(process.argv.slice(2), {
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

    private constructor(private dirname: string, protected option: DevelopConfig) {

    }

    run(gulp: Gulp, env: EnvOption): Promise<any> {
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

    private bindingConfig(cfg: TaskConfig): TaskConfig {
        cfg.globals = this.globals;
        cfg.fileFilter = cfg.fileFilter || files;
        cfg.runSequence = cfg.runSequence || runSequence;
        cfg.dynamicTasks = cfg.dynamicTasks || ((tasks: DynamicTask | DynamicTask[]) => {
            return dynamicTask(tasks, cfg.oper, cfg.env);
        });
        cfg.getDist = cfg.getDist || ((asserts?: Asserts) => {
            asserts = asserts || cfg.option;
            let dist: string;
            switch (cfg.oper) {
                case Operation.build:
                    dist = asserts.build || asserts.dist;
                    break;
                case Operation.test:
                    dist = asserts.test || asserts.build || asserts.dist;
                    break;
                case Operation.e2e:
                    dist = asserts.e2e || asserts.build || asserts.dist;
                    break;
                case Operation.release:
                    dist = asserts.release || asserts.dist;
                    break;
                case Operation.deploy:
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

    /**
     * run task sequence.
     * 
     * @protected
     * @param {Gulp} gulp
     * @param {Src[]} tasks
     * @returns {Promise<any>}
     * 
     * @memberOf Development
     */
    runSequence(gulp: Gulp, tasks: Src[]): Promise<any> {
        return runSequence(gulp, tasks);
    }

    protected toSquence(tasks: Array<TaskResult | TaskResult[] | void>, oper: Operation): Src[] {
        let seq: Src[] = [];
        _.each(tasks, t => {
            if (!t) {
                return;
            }
            if (_.isString(t)) {
                seq.push(t);
            } else if (_.isArray(t)) {
                seq.push(_.flatten(this.toSquence(t, oper)));
            } else {
                if (t.name) {
                    if (t.oper && ((t.oper & oper) > 0)) {
                        seq.push(t.name);
                    }
                }
            }
        });
        return seq;
    }

    protected loadTasks(gulp: Gulp, tasks: Asserts | Asserts[], env: EnvOption): Promise<Src[]> {
        return Promise.all<Src[]>(
            _.map(_.isArray(tasks) ? <TaskOption[]>tasks : [<TaskOption>tasks], optask => {
                optask.dist = optask.dist || 'dist';
                let oper: Operation;
                if (env.deploy) {
                    oper = Operation.deploy;
                } else if (env.release) {
                    oper = Operation.release;
                } else if (env.e2e) {
                    oper = Operation.e2e;
                } else if (env.test) {
                    oper = Operation.test;
                } else {
                    oper = Operation.build;
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
                        } else {
                            cfg = this.bindingConfig(cfg);
                            return this.loadSubTask(gulp, cfg)
                                .then(subtask => {
                                    return Promise.all([
                                        loader.load(cfg),
                                        this.loadAssertTasks(gulp, cfg)
                                    ])
                                        .then(tasks => {
                                            console.log(chalk.green('tasks loaded.'));
                                            return this.setup(gulp, cfg, tasks[0], tasks[1], subtask)
                                        });
                                });
                        }
                    });
            })
        ).then(tsq => {
            return _.flatten(tsq);
        });
    }

    protected setup(gulp: Gulp, config: TaskConfig, tasks: Task[], assertsTask: Src, subGroupTask: Src): Promise<Src[]> {
        return Promise.all(_.map(tasks, t => {
            return t(gulp, config);
        }))
            .then(ts => {
                let tsqs: Src[] = this.toSquence(ts, config.oper);
                if (_.isFunction(config.option.runTasks)) {
                    return config.option.runTasks(config.oper, tsqs, subGroupTask, assertsTask);
                } else if (_.isArray(config.option.runTasks)) {
                    tsqs = config.option.runTasks;
                } else if (config.runTasks) {
                    return config.runTasks(subGroupTask, tsqs, assertsTask);
                }

                assertsTask && tsqs.splice(0, 0, assertsTask)
                subGroupTask && tsqs.splice(0, 0, subGroupTask);

                return tsqs;
            });
    }

    /**
     * load sub tasks as group task.
     * 
     * @protected
     * @param {Gulp} gulp
     * @param {TaskConfig} config
     * @returns {Promise<Src>}
     * 
     * @memberOf Development
     */
    protected loadSubTask(gulp: Gulp, config: TaskConfig): Promise<Src> {
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
                        })
                        return subName;
                    } else {
                        return null;
                    }
                });
        } else {
            return Promise.resolve(null);
        }
    }

    protected loadAssertTasks(gulp: Gulp, config: TaskConfig): Promise<Src> {
        let optask = config.option;
        if (optask.asserts) {
            let tasks: Asserts[] = [];
            _.each(_.keys(optask.asserts), name => {
                let op: Asserts;
                let aop = optask.asserts[name];
                if (_.isString(aop) || _.isArray(aop)) {
                    op = <Asserts>{ src: aop, loader: [{ name: name, pipes: [] }, { name: `${name}-watch`, watch: [name] }] };
                } else {
                    op = aop;
                };
                if (_.isNull(op) || _.isUndefined(op)) {
                    return;
                }
                optask.name = name;
                op.src = op.src || (optask.src + '/**/*.' + name);
                op.dist = op.dist || optask.dist;
                tasks.push(op);
            });

            return Promise.all(_.map(tasks, task => {
                return this.loadTasks(gulp, task, config.env)
                    .then(sq => {
                        return {
                            task: task,
                            sq: sq
                        }
                    });
            }))
                .then(tseq => {
                    // asserts tasks run mutil.
                    return _.map(tseq, t => {
                        let subseq = t.sq;
                        if (subseq && subseq.length > 0) {
                            gulp.task(t.task.name, () => {
                                return runSequence(gulp, subseq);
                            })
                            return t.task.name;
                        }
                        return t.sq;
                    });
                });
        } else {
            return Promise.resolve(null);
        }
    }

    protected createLoader(option: TaskOption): ITaskLoader {
        let loader = null;
        if (!_.isFunction(this.option.loaderFactory)) {
            let factory = new LoaderFactory();
            this.option.loaderFactory = (opt: TaskOption) => {
                return factory.create(opt);
            }
        }
        loader = this.option.loaderFactory(option);
        return loader;
    }


    protected printHelp(help: boolean | string) {
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

        } else {

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

/**
 * run task sequence.
 * 
 * @protected
 * @param {Gulp} gulp
 * @param {Src[]} tasks
 * @returns {Promise<any>}
 * 
 * @memberOf Development
 */
export function runSequence(gulp: Gulp, tasks: Src[]): Promise<any> {
    let ps = Promise.resolve();
    if (tasks && tasks.length > 0) {
        _.each(tasks, task => {
            ps = ps.then(() => {
                let taskErr = null, taskStop = null;
                return new Promise((reslove, reject) => {
                    let tskmap: any = {};
                    _.each(_.isArray(task) ? task : [task], t => {
                        tskmap[t] = false;
                    });
                    taskErr = (err) => {
                        reject(err);
                    };
                    taskStop = (e: any) => {
                        tskmap[e.task] = true;
                        if (!_.some(_.values(tskmap), it => !it)) {
                            reslove();
                        }
                    }
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

/**
 * filter fileName in directory.
 * 
 * @export
 * @param {string} directory
 * @param {((fileName: string) => boolean)} [express]
 * @returns {string[]}
 */
export function files(directory: string, express?: ((fileName: string) => boolean)): string[] {
    let res: string[] = [];
    express = express || ((fn) => true);
    _.each(readdirSync(directory), fname => {
        let filePn = directory + '/' + fname;
        var fst = lstatSync(filePn);
        if (!fst.isDirectory()) {
            if (express(filePn)) {
                res.push(filePn)
            }
        } else {
            res = res.concat(files(filePn, express))
        }
    });
    return res;
}

/**
 * create dynamic watch task.
 * 
 * @param {DynamicTask} dt
 * @returns
 */
function createWatchTask(dt: DynamicTask) {
    return (gulp: Gulp, cfg: TaskConfig) => {
        if (!_.isFunction(_.last(dt.watch))) {
            dt.watch.push(<WatchCallback>(event: WatchEvent) => {
                dt.watchChanged && dt.watchChanged(event, cfg);
            });
        }
        gulp.task(dt.name, () => {
            console.log('watch, src:', chalk.cyan.call(chalk, cfg.option.src), ' , watch task:', chalk.cyan.call(chalk, dt.watch))
            gulp.watch(cfg.option.src, dt.watch)
        });

        return dt.name;
    };
}

/**
 * promise task.
 * 
 * @param {DynamicTask} dt
 * @returns
 */
function createTask(dt: DynamicTask) {
    return (gulp: Gulp, cfg: TaskConfig) => {
        gulp.task(dt.name, (callback) => {
            return createTaskWork(gulp, cfg, dt);
        });
        return dt.name;
    };
}
function createTaskWork(gulp: Gulp, cfg: TaskConfig, dt: DynamicTask) {

    let src = Promise.resolve(gulp.src(cfg.option.src));
    // gulp.src(cfg.option.src)
    // .once('error', () => {
    //     process.exit(1);
    // })
    // .once('end', () => {
    //     process.exit();
    // }));

    if (dt.pipes) {
        _.each(dt.pipes, (p: Pipe) => {
            src = src.then(psrc => {
                return Promise.resolve((_.isFunction(p) ? p(cfg) : p))
                    .then(stram => {
                        return psrc.pipe(stram)
                    });
            });
        })
    } else if (dt.pipe) {
        src = src.then((src => {
            return dt.pipe(src, cfg);
        }));
    }
    src.then(stream => {
        if (dt.output) {
            return Promise.all(_.map(_.isArray(dt.output) ? dt.output : [dt.output], output => {
                return new Promise((resolve, reject) => {
                    Promise.resolve<NodeJS.ReadWriteStream>((_.isFunction(output) ? output(stream, cfg) : output))
                        .then(output => {
                            stream.pipe(output)
                                .once('end', resolve)
                                .once('error', reject);
                        }).catch(err => {
                            reject(err);
                        })

                });
            }));
        } else {
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

/**
 * dynamic build tasks.
 * 
 * @export
 * @param {(DynamicTask | DynamicTask[])} tasks
 * @param {Operation} oper
 * @returns {Task[]}
 */
export function dynamicTask(tasks: DynamicTask | DynamicTask[], oper: Operation, env: EnvOption): Task[] {
    let taskseq: Task[] = [];
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
        } else if (_.isFunction(dt.task)) { // custom task
            console.log('register custom dynamic task:', chalk.cyan(dt.name));
            taskseq.push((gulp: Gulp, cfg: TaskConfig) => {
                gulp.task(dt.name, () => {
                    dt.task(cfg, gulp);
                });

                return dt.name;
            });
        } else {
            console.log('register pipes  dynamic task:', chalk.cyan(dt.name));
            // pipe stream task.
            taskseq.push(createTask(dt));
        }
    });

    return taskseq;
}


