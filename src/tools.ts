import * as _ from 'lodash';
import { Gulp, TaskCallback } from 'gulp';

import * as minimist from 'minimist';
import { ITaskLoader } from './ITaskLoader';
import { LoaderFactory } from './LoaderFactory';
import { Src, toSequence, runSequence, ITaskContext, IAsserts, ITaskInfo, ITask, ITaskOption, IEnvOption } from 'development-core';
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
     * @param {(DevelopConfig | ITaskOption[])} setting
     * @returns {Development}
     * 
     * @memberOf Development
     */
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | ITaskOption[]): Development {
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

    private constructor(private dirname: string, protected option: DevelopConfig) {

    }

    run(gulp: Gulp, env: IEnvOption): Promise<any> {
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

    protected loadTasks(gulp: Gulp, tasks: ITaskOption | ITaskOption[], env: IEnvOption): Promise<Src[]> {
        return Promise.all<Src[]>(
            _.map(_.isArray(tasks) ? <ITaskOption[]>tasks : [<ITaskOption>tasks], optask => {
                optask.dist = optask.dist || 'dist';

                console.log(chalk.grey('begin load task via loader:'), optask.loader);
                let loader = this.createLoader(optask);

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
        let optask = ctx.option;
        if (ctx.option.asserts) {
            let tasks: IAsserts[] = [];
            _.each(_.keys(optask.asserts), name => {
                let op: IAsserts;
                let aop = optask.asserts[name];
                if (_.isString(aop)) {
                    op = <IAsserts>{ src: aop, loader: [{ name: name, pipes: [] }, { name: `${name}-watch`, watchTasks: [name] }] };
                } else if (_.isArray(aop)) {
                    if (_.some(aop, it => _.isString(aop))) {
                        op = <IAsserts>{ src: aop, loader: [{ name: name, pipes: [] }, { name: `${name}-watch`, watchTasks: [name] }] };
                    } else {
                        op = <IAsserts>{ loader: aop };
                    }
                } else if (_.isFunction(aop)) {
                    op = { loader: aop };
                } else {
                    op = aop;
                };
                if (_.isNull(op) || _.isUndefined(op)) {
                    return;
                }
                op.name = ctx.subTaskName(name, '-assert');
                op.src = op.src || (ctx.getSrc() + '/**/*.' + name);
                op.dist = op.dist || ctx.getDist();
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

                            name = ctx.subTaskName(t.task)
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

    protected createLoader(option: ITaskOption): ITaskLoader {
        let loader = null;
        if (!_.isFunction(this.option.loaderFactory)) {
            let factory = new LoaderFactory();
            this.option.loaderFactory = (opt: ITaskOption) => {
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




