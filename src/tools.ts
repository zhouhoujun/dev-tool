import * as _ from 'lodash';
import { Gulp, TaskCallback } from 'gulp';

import * as minimist from 'minimist';
import { ITaskLoader } from './ITaskLoader';
import { LoaderFactory } from './LoaderFactory';
import {
    Src, currentOperation, toSequence, runSequence
    , Asserts, Task, TaskOption, Operation, EnvOption
    , ITaskResult, TaskResult, TaskConfig
} from 'development-core';
import { DevelopConfig } from './DevelopConfig';
import * as chalk from 'chalk';

export * from './DevelopConfig';
// export * from 'development-core';
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
    /**
     * create development tool.
     * 
     * @static
     * @param {Gulp} gulp
     * @param {string} dirname
     * @param {(DevelopConfig | TaskOption[])} setting
     * @returns {Development}
     * 
     * @memberOf Development
     */
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | TaskOption[]): Development {
        let option = _.isArray(setting) ? { tasks: setting } : setting;
        let devtool = new Development(dirname, option);
        option.setupTask = option.setupTask || 'build';
        gulp.task(option.setupTask, (callback: TaskCallback) => {
            var options: EnvOption = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development' }
            });
            return devtool.run(gulp, options);
        });

        gulp.task('default', () => {
            gulp.start(option.setupTask);
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
        // cfg.env = cfg.env || this.env;
        cfg.globals = this.globals;
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

    protected toSequence(tasks: Array<TaskResult | TaskResult[] | void>, oper: Operation): Src[] {
        return toSequence(tasks, oper);
    }

    protected loadTasks(gulp: Gulp, tasks: TaskOption | TaskOption[], env: EnvOption): Promise<Src[]> {
        return Promise.all<Src[]>(
            _.map(_.isArray(tasks) ? <TaskOption[]>tasks : [<TaskOption>tasks], optask => {
                optask.dist = optask.dist || 'dist';
                let oper: Operation = currentOperation(env);

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

    protected setup(gulp: Gulp, config: TaskConfig, tasks: Task[], assertsTask: TaskResult, subGroupTask: TaskResult): Promise<Src[]> {
        return Promise.all(_.map(tasks, t => {
            return t(gulp, config);
        }))
            .then(ts => {
                let tsqs: Src[] = this.toSequence(ts, config.oper);
                if (_.isFunction(config.option.runTasks)) {
                    return config.option.runTasks(config.oper, tsqs, subGroupTask, assertsTask);
                } else if (_.isArray(config.option.runTasks)) {
                    tsqs = config.option.runTasks;
                } else if (config.runTasks) {
                    return config.runTasks(subGroupTask, tsqs, assertsTask);
                }

                config.addTask(tsqs, assertsTask);
                config.addTask(tsqs, subGroupTask);

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
    protected loadSubTask(gulp: Gulp, config: TaskConfig): Promise<TaskResult> {
        let optask = config.option;
        if (optask.tasks) {
            _.each(_.isArray(optask.tasks) ? optask.tasks : [optask.tasks], subopt => {
                subopt.name = config.subTaskName(subopt.name);
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
                        let subName = config.subTaskName(`${frn}-${lsn}`, '-sub');
                        gulp.task(subName, () => {
                            return runSequence(gulp, subseq);
                        })

                        if (_.isNumber(config.option.subTaskOrder)) {
                            return <ITaskResult>{
                                order: config.option.subTaskOrder,
                                name: subName
                            };
                        } else {
                            return subName;
                        }
                    } else {
                        return null;
                    }
                });
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * load asserts tasks.
     * 
     * @protected
     * @param {Gulp} gulp
     * @param {TaskConfig} config
     * @returns {Promise<Src>}
     * 
     * @memberOf Development
     */
    protected loadAssertTasks(gulp: Gulp, config: TaskConfig): Promise<TaskResult> {
        let optask = config.option;
        if (optask.asserts) {
            let tasks: Asserts[] = [];
            _.each(_.keys(optask.asserts), name => {
                let op: Asserts;
                let aop = optask.asserts[name];
                if (_.isString(aop)) {
                    op = <Asserts>{ src: aop, loader: [{ name: name, pipes: [] }, { name: `${name}-watch`, watch: [name] }] };
                } else if (_.isArray(aop)) {
                    if (_.some(aop, it => _.isString(aop))) {
                        op = <Asserts>{ src: aop, loader: [{ name: name, pipes: [] }, { name: `${name}-watch`, watch: [name] }] };
                    } else {
                        op = <Asserts>{ loader: aop };
                    }
                } else {
                    op = aop;
                };
                if (_.isNull(op) || _.isUndefined(op)) {
                    return;
                }
                op.name = config.subTaskName(name, '-assert');
                op.src = op.src || (optask.src + '/**/*.' + name);
                op.dist = op.dist || optask.dist;
                tasks.push(op);
            });

            return Promise.all(_.map(tasks, task => {
                return this.loadTasks(gulp, <TaskOption>task, config.env)
                    .then(sq => {
                        return {
                            task: task,
                            sq: sq
                        }
                    });
            }))
                .then(tseq => {
                    // asserts tasks run mutil.
                    let assertSeq = _.map(tseq, t => {
                        let subseq = t.sq;
                        if (subseq && subseq.length > 0) {
                            if (subseq.length === 1) {
                                return subseq[0];
                            }
                            gulp.task(t.task.name, () => {
                                return runSequence(gulp, subseq);
                            })
                            return t.task.name;
                        }
                        return t.sq;
                    });
                    if (_.isNumber(config.option.assertsOrder)) {
                        return <ITaskResult>{
                            order: config.option.assertsOrder,
                            name: assertSeq
                        };
                    } else {
                        return assertSeq;
                    }
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




