import * as _ from 'lodash';
import { Gulp, TaskCallback } from 'gulp';

import * as minimist from 'minimist';
import { ITaskLoader } from './ITaskLoader';
import { LoaderFactory } from './LoaderFactory';
import { Operation, Src, toSequence, runSequence, ITaskContext, ITaskInfo, ITask, IEnvOption, IDynamicTaskOption } from 'development-core';
import { TaskOption, ITaskOption, IAssertOption } from './TaskOption';
import { DevelopConfig } from './DevelopConfig';
import * as chalk from 'chalk';

export * from './DevelopConfig';
export * from './TaskOption';
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
     * @param {(DevelopConfig | Array<ITaskOption | IAssertOption | IDynamicTaskOption>)} setting
     * @returns {Development}
     * 
     * @memberOf Development
     */
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | Array<ITaskOption | IAssertOption | IDynamicTaskOption>): Development {
        let option = _.isArray(setting) ? { tasks: setting } : setting;
        let devtool = new Development(dirname, option);
        option.setupTask = option.setupTask || 'build';
        gulp.task(option.setupTask, (callback: TaskCallback) => {
            var options: IEnvOption = minimist(process.argv.slice(2), {
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

    /**
     * Creates an instance of Development.
     * 
     * @param {string} dirname
     * @param {DevelopConfig} config
     * 
     * @memberOf Development
     */
    private constructor(private dirname: string, protected config: DevelopConfig) {

    }

    /**
     * run task.
     * 
     * @param {Gulp} gulp
     * @param {IEnvOption} env
     * @returns {Promise<any>}
     * 
     * @memberOf Development
     */
    run(gulp: Gulp, env: IEnvOption): Promise<any> {
        if (!env.root) {
            env.root = this.dirname;
        }

        if (env.help) {
            console.log(chalk.grey('... main help  ...'));
            this.printHelp(env.help);
        }

        return this.loadTasks(gulp, this.config.tasks, env)
            .then(tseq => {
                // console.log(chalk.grey('run sequenec tasks:'), tseq);
                return runSequence(gulp, tseq);
            })
            .catch(err => {
                console.error(err);
                process.exit(1);
            });
    }

    private bindingContext(ctx: ITaskContext): ITaskContext {
        // cfg.env = cfg.env || this.env;
        ctx.globals = this.globals;
        return ctx;
    }

    protected loadTasks(gulp: Gulp, tasks: TaskOption, env: IEnvOption): Promise<Src[]> {
        return Promise.all<Src[]>(
            _.map(_.isArray(tasks) ? <ITaskOption[]>tasks : [<ITaskOption>tasks], optask => {
                optask.dist = optask.dist || 'dist';
                // console.log(chalk.grey('begin load task via loader:'), optask.loader);
                let loader = this.createLoader(optask, env);

                return loader.loadContext(env)
                    .then(ctx => {
                        this.bindingContext(ctx);
                        console.log(chalk.green('task context loaded.'));
                        if (ctx.env.help) {
                            if (ctx.printHelp) {
                                console.log(chalk.grey('...development default help...'));
                                ctx.printHelp(_.isString(ctx.env.help) ? ctx.env.help : '');
                            }
                            return [];
                        } else {
                            return this.loadSubTask(gulp, ctx)
                                .then(subtask => {
                                    return Promise.all([
                                        loader.load(ctx),
                                        this.loadAssertTasks(gulp, ctx)
                                    ])
                                        .then(tasks => {
                                            console.log(chalk.green('tasks loaded.'));
                                            return this.setup(gulp, ctx, tasks[0], tasks[1], subtask)
                                        });
                                });
                        }
                    });
            })
        ).then(tsq => {
            return _.flatten(tsq);
        });
    }

    protected setup(gulp: Gulp, ctx: ITaskContext, tasks: ITask[], assertsTask: ITaskInfo, subGroupTask: ITaskInfo): Promise<Src[]> {
        return Promise.resolve(toSequence(gulp, tasks, ctx))
            .then(tsqs => {
                // if (_.isFunction(context.option['runTasks'])) {
                //     return context.option['runTasks'](context.oper, tsqs, subGroupTask, assertsTask);
                // } else if (_.isArray(context.option['runTasks'])) {
                //     tsqs = context.option['runTasks'];
                // } else 
                if (ctx.runTasks) {
                    return ctx.runTasks(tsqs, assertsTask, subGroupTask);
                }
                // console.log(assertsTask);
                ctx.addToSequence(tsqs, assertsTask);
                ctx.addToSequence(tsqs, subGroupTask);

                return tsqs;
            });
    }

    /**
     * load sub tasks as group task.
     * 
     * @protected
     * @param {Gulp} gulp
     * @param {ITaskContext} ctx
     * @returns {Promise<Src>}
     * 
     * @memberOf Development
     */
    protected loadSubTask(gulp: Gulp, ctx: ITaskContext): Promise<ITaskInfo> {

        if (ctx['tasks']) {
            let optask = <ITaskOption>ctx.option;
            _.each(_.isArray(optask.tasks) ? optask.tasks : [optask.tasks], subopt => {
                subopt.name = ctx.subTaskName(subopt.name);
                subopt.src = subopt.src || optask.src;
                subopt.dist = subopt.dist || optask.dist;
            });
            return this.loadTasks(gulp, optask.tasks, ctx.env)
                .then(subseq => {
                    if (subseq && subseq.length > 0) {
                        let first = _.first(subseq);
                        let last = _.last(subseq);
                        let frn = _.isArray(first) ? _.first(first) : first;
                        let lsn = _.isArray(last) ? _.last(last) : last;

                        let subName = ctx.subTaskName(`${frn}-${lsn}`, '-sub');
                        gulp.task(subName, () => {
                            return runSequence(gulp, subseq);
                        });

                        return <ITaskInfo>{
                            order: optask.subTaskOrder,
                            taskName: subName
                        };
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
     * @param {ITaskContext} ctx
     * @returns {Promise<Src>}
     * 
     * @memberOf Development
     */
    protected loadAssertTasks(gulp: Gulp, ctx: ITaskContext): Promise<ITaskInfo> {
        let optask = <IAssertOption>ctx.option;
        if (optask.asserts) {
            let tasks: IAssertOption[] = [];
            _.each(_.keys(optask.asserts), name => {
                let op: IAssertOption;
                let sr = optask.asserts[name];
                if (_.isString(sr)) {
                    op = <IAssertOption>{ src: sr, loader: [{ name: name, pipes: [], watch: true }] };
                } else if (_.isArray(sr)) {
                    if (sr.length > 0) {
                        if (_.isString(_.first(<string[]>sr))) {
                            op = <IAssertOption>{ src: <string[]>sr, loader: [{ name: name, pipes: [], watch: true }] };
                        } else {
                            op = <IAssertOption>{ loader: <IDynamicTaskOption[]>sr, watch: true };
                        }
                    }
                } else if (_.isFunction(sr)) {
                    op = { loader: sr };
                } else {
                    op = sr;
                }

                if (_.isNull(op) || _.isUndefined(op)) {
                    return;
                }
                op.name = op.name || ctx.subTaskName(name);
                op.src = op.src || (ctx.getSrc({ oper: Operation.build }) + '/**/*.' + name);
                op.dist = op.dist || ctx.getDist({ oper: Operation.build });
                tasks.push(op);
            });

            return Promise.all(_.map(tasks, task => {
                return this.loadTasks(gulp, <ITaskOption>task, ctx.env)
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
                        let name;
                        if (subseq && subseq.length > 0) {
                            if (subseq.length === 1) {
                                return subseq[0];
                            }

                            name = ctx.subTaskName(t.task, '-assert')
                            gulp.task(name, () => {
                                return runSequence(gulp, subseq);
                            });
                        } else {
                            name = ctx.subTaskName(t.sq);
                        }

                        return name;
                    });


                    return <ITaskInfo>{
                        order: ctx.option.assertsOrder,
                        taskName: assertSeq
                    }
                });
        } else {
            return Promise.resolve(null);
        }
    }

    protected createLoader(option: TaskOption, env: IEnvOption): ITaskLoader {
        let loader = null;
        if (!_.isFunction(this.config.loaderFactory)) {
            let factory = new LoaderFactory();
            this.config.loaderFactory = (opt: ITaskOption) => {
                return factory.create(opt, env);
            }
        }
        loader = this.config.loaderFactory(option, env);
        return loader;
    }


    protected printHelp(help: boolean | string) {
        if (help === 'en') {

            console.log(`
                /**
                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]
                 * @params
                 *  --env  development or production;
                 *  --context app setting
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
                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]
                 * @params
                 *  --env 发布环境 默认开发环境development;
                 *  --context 设置配置文件;
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




