import * as _ from 'lodash';
import { Gulp, TaskCallback } from 'gulp';

import * as minimist from 'minimist';
import { ITaskLoader } from './ITaskLoader';
import { LoaderFactory } from './loaderFactory';
import { Operation, ITaskConfig, Src, toSequence, runSequence, zipSequence, sortOrder, currentOperation, flattenSequence, ITaskContext, ITaskInfo, ITask, IEnvOption, IDynamicTaskOption, RunWay } from 'development-core';
import { TaskOption, ITaskOption, IAssertOption } from './TaskOption';
import { IContext } from './IContext';
import { Context } from './Context';
import * as chalk from 'chalk';

interface TaskSeq {
    opt: ITaskOption,
    seq: Src[]
}

export class Development extends Context {

    /**
     * create development tool.
     * 
     * @static
     * @param {Gulp} gulp
     * @param {string} dirname
     * @param {(ITaskConfig | Array<ITaskOption | IAssertOption | IDynamicTaskOption>)} setting
     * @param {any} [runWay=RunWay.sequence]
     * @returns {Development}
     * 
     * @memberOf Development
     */
    static create(gulp: Gulp, dirname: string, setting: ITaskConfig | Array<ITaskOption | IAssertOption | IDynamicTaskOption>, runWay = RunWay.sequence): Development {
        let config: ITaskConfig;
        let option: ITaskOption;
        if (_.isArray(setting)) {
            let env: IEnvOption = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development', root: dirname }
            });
            config = { option: <ITaskOption>{ tasks: setting, runWay: runWay }, env: env };
        } else {
            config = setting;
            option = config.option as ITaskOption;
            if (!_.isUndefined(option.runWay)) {
                option.runWay = runWay;
            }
        }


        let devtool = new Development(config);

        gulp.task('build', (callback: TaskCallback) => {
            let env: IEnvOption = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development' }
            });
            devtool.setConfig({
                env: env
            });
            return devtool.run();
        });

        gulp.task('start', (callback: TaskCallback) => {
            let env: IEnvOption = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development' }
            });
            if (!env.task) {
                return Promise.reject('start task can not empty!');
            }
            devtool.setConfig({
                env: env
            });
            let tasks = env.task.split(',');
            return devtool.find<Context>(ctx => tasks.indexOf(ctx.toStr(ctx.option.name)) >= 0)
                .run();
        })

        gulp.task('default', () => {
            gulp.start('build');
        });

        return devtool;
    }

    /**
     * Creates an instance of Development.
     * 
     * @param {ITaskConfig} config
     * @param {IContext} [parent]
     * 
     * @memberof Development
     */
    public constructor(protected config: ITaskConfig, parent?: IContext) {
        super(config, parent);
    }


    help(help: boolean | string) {
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


    // /**
    //  * run task.
    //  * 
    //  * @param {Gulp} gulp
    //  * @param {IEnvOption} env
    //  * @returns {Promise<any>}
    //  * 
    //  * @memberOf Development
    //  */
    // run(env: IEnvOption): Promise<any> {
    //     return this.setupTasks(gulp, env)
    //         .then(seq => {
    //             let tseq = env.task ? env.task.split(',') : seq;
    //             let gbctx = this.getContext(env);
    //             this.emit('beforRun', tseq, gbctx);
    //             if (this.config.runWay === RunWay.parallel) {
    //                 return runSequence(gulp, [flattenSequence(gulp, tseq, gbctx)]);
    //             } else {
    //                 return runSequence(gulp, tseq);
    //             }
    //         })
    //         .then(() => {
    //             let gbctx = this.getContext(env);
    //             this.emit('afterRun', gbctx);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             process.exit(1);
    //         });
    // }

    // setupTasks(gulp: Gulp, env: IEnvOption): Promise<Src[]> {
    //     if (!env.root) {
    //         env.root = this.dirname;
    //     }

    //     if (env.help) {
    //         console.log(chalk.grey('... main help  ...'));
    //         this.printHelp(env.help);
    //     }

    //     let gbctx = this.getContext(env);
    //     this.emit('beforSetup', gbctx);
    //     return this.loadTasks(gulp, this.config.tasks, gbctx)
    //         .then(tsq => {
    //             this.emit('afterSetup', tsq, gbctx);
    //             return tsq;
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             process.exit(1);
    //         });
    // }



    // private globalctx: IContext;
    // getContext(env) {
    //     if (!this.globalctx || this.globalctx.env !== env) {
    //         let option = this.config.option || {};
    //         this.globalctx = <IContext>this.config.contextFactory({
    //             env: env,
    //             option: option
    //         });
    //     }

    //     return this.globalctx;
    // }

    // /**
    //  * load asserts tasks.
    //  * 
    //  * @protected
    //  * @param {Gulp} gulp
    //  * @param {ITaskContext} ctx
    //  * @returns {Promise<Src>}
    //  * 
    //  * @memberOf Development
    //  */
    // protected loadAssertTasks(gulp: Gulp, ctx: IContext): Promise<ITaskInfo> {
    //     let optask = <IAssertOption>ctx.option;

    //     let assertOrder = ctx.to(optask.assertsOrder);
    //     if (!_.isNumber(assertOrder) && assertOrder) {
    //         optask.assertsRunWay = optask.assertsRunWay || assertOrder.runWay;
    //     }
    //     optask.assertsRunWay = optask.assertsRunWay || RunWay.parallel;

    //     if (optask.asserts) {
    //         let tasks: IAssertOption[] = [];
    //         _.each(_.keys(optask.asserts), name => {
    //             let op: IAssertOption;
    //             let sr = optask.asserts[name];
    //             if (_.isString(sr)) {
    //                 op = <IAssertOption>{ src: sr };
    //             } else if (_.isNumber(sr)) {
    //                 // watch with Operation.autoWatch.
    //                 op = <IAssertOption>{ loader: [{ oper: sr, name: name, pipes: [] }] };
    //             } else if (_.isFunction(sr)) {
    //                 op = { loader: sr };
    //             } else if (_.isArray(sr)) {
    //                 if (sr.length > 0) {
    //                     if (!_.some(<string[]>sr, it => !_.isString(it))) {
    //                         op = <IAssertOption>{ src: <string[]>sr };
    //                     } else {
    //                         op = <IAssertOption>{ loader: <IDynamicTaskOption[]>sr, watch: true };
    //                     }
    //                 }
    //             } else {
    //                 op = sr;
    //             }

    //             if (_.isNull(op) || _.isUndefined(op)) {
    //                 return;
    //             }
    //             if (!op.loader) {
    //                 op.loader = [{ name: name, pipes: [], watch: true }]
    //             }
    //             op.name = op.name || ctx.subTaskName(name);
    //             op.src = op.src || (ctx.getSrc({ oper: Operation.default }) + '/**/*.' + name);
    //             // op.dist = op.dist || ctx.getDist({ oper: Operation.build });
    //             if (!op.order) {
    //                 if (optask.assertsRunWay) {
    //                     op.order = { runWay: optask.assertsRunWay };
    //                 } else if (!_.isNumber(assertOrder)) {
    //                     op.order = { runWay: assertOrder.runWay };
    //                 }
    //             }
    //             tasks.push(op);
    //         });

    //         return this.loadTasks(gulp, tasks, ctx)
    //             // .then(sq => {
    //             //     return {
    //             //         task: task,
    //             //         sq: sq
    //             //     }
    //             // })

    //             .then(tseq => {
    //                 // asserts tasks run mutil.
    //                 // let assertSeq = _.map(tseq, t => {
    //                 //     return zipSequence(gulp, t.sq, ctx, (name, runway) => ctx.subTaskName(t.task.name, runway === RunWay.sequence ? '-asserts-seq' : '-assert-paral'));
    //                 // });

    //                 let taskname;
    //                 // if (optask.assertsRunWay === RunWay.sequence) {
    //                 //     taskname = assertSeq;
    //                 // } else {
    //                 taskname = zipSequence(gulp, tseq, ctx, (name, runway) => name + (runway === RunWay.sequence ? '-asserts-seq' : '-assert-paral'));
    //                 // }

    //                 return <ITaskInfo>{
    //                     order: optask.assertsOrder,
    //                     taskName: taskname
    //                 }
    //             });
    //     } else {
    //         return Promise.resolve(null);
    //     }
    // }


    // protected createLoader(option: TaskOption, parent: IContext): ITaskLoader {
    //     if (!_.isFunction(this.config.loaderFactory)) {
    //         let factory = new LoaderFactory();
    //         return factory.create(option, parent.env, (cfg, p) => {
    //             return this.config.contextFactory(cfg, p || parent);
    //         });
    //     } else {
    //         return this.config.loaderFactory(option, parent.env);
    //     }
    // }

    // protected loadTasks(gulp: Gulp, taskOptions: TaskOption, parent: IContext): Promise<Src[]> {
    //     let tasks = _.isArray(taskOptions) ? <ITaskOption[]>taskOptions : [<ITaskOption>taskOptions];
    //     return Promise.all<Src[]>(
    //         _.map(tasks, optask => {
    //             if (optask.oper && (this.globalctx.oper & optask.oper) <= 0) {
    //                 return [];
    //             }
    //             // optask.dist = optask.dist || 'dist';
    //             // console.log(chalk.grey('begin load task via loader:'), optask.loader);
    //             let loader = this.createLoader(optask, parent);

    //             return loader.loadContext(parent.env)
    //                 .then(ctx => {
    //                     // console.log(chalk.green('task context loaded.'));
    //                     if (ctx.env.help) {
    //                         if (ctx.printHelp) {
    //                             console.log(chalk.grey('...development default help...'));
    //                             ctx.printHelp(_.isString(ctx.env.help) ? ctx.env.help : '');
    //                         }
    //                         return [];
    //                     } else {
    //                         return Promise.all([
    //                             loader.load(ctx),
    //                             this.loadAssertTasks(gulp, ctx),
    //                             this.loadSubTask(gulp, ctx)
    //                         ])
    //                             .then(tks => {
    //                                 // console.log(chalk.green('tasks loaded.'));
    //                                 return this.setupTask(gulp, ctx, tks[0], tks[1], tks[2]);
    //                             });
    //                     }
    //                 });
    //         })
    //     )
    //         .then(tsq => {
    //             let rst: Src[] = [];
    //             let tasklist: TaskSeq[] = _.map(tsq, (sq, idx) => {
    //                 return <TaskSeq>{
    //                     opt: tasks[idx],
    //                     seq: sq
    //                 }
    //             });

    //             let ordertask = sortOrder(tasklist, itm => itm.opt.order, parent);
    //             _.each(ordertask, (t, idx) => {
    //                 if (_.isArray(t)) {
    //                     rst.push(_.filter(_.map(t, it => zipSequence(gulp, it.seq, parent)), it => it));
    //                 } else {
    //                     let tk = zipSequence(gulp, t.seq, parent);
    //                     if (tk) {
    //                         rst.push(tk);
    //                     }
    //                 }
    //             });
    //             return rst;

    //         });
    // }

    // protected setupTask(gulp: Gulp, ctx: ITaskContext, tasks: ITask[], assertsTask: ITaskInfo, subGroupTask: ITaskInfo): Promise<Src[]> {
    //     return Promise.resolve(toSequence(gulp, tasks, ctx))
    //         .then(tsqs => {
    //             if (ctx.runTasks) {
    //                 return ctx.runTasks(tsqs, assertsTask, subGroupTask);
    //             }
    //             // console.log(assertsTask);
    //             ctx.addToSequence(tsqs, assertsTask);
    //             ctx.addToSequence(tsqs, subGroupTask);

    //             return tsqs;
    //         });
    // }

    // /**
    //  * load sub tasks as group task.
    //  * 
    //  * @protected
    //  * @param {Gulp} gulp
    //  * @param {IContext} ctx
    //  * @returns {Promise<ITaskInfo>}
    //  * 
    //  * @memberOf Development
    //  */
    // protected loadSubTask(gulp: Gulp, ctx: IContext): Promise<ITaskInfo> {
    //     if (ctx.option['tasks']) {
    //         let optask = <ITaskOption>ctx.option;
    //         _.each(_.isArray(optask.tasks) ? optask.tasks : [optask.tasks], subopt => {
    //             if (!subopt.order) {
    //                 let subOrder = ctx.to(optask.subTaskOrder);
    //                 if (!_.isNumber(subOrder) && subOrder) {
    //                     optask.assertsRunWay = optask.assertsRunWay || subOrder.runWay;
    //                 } else if (optask.subTaskRunWay) {
    //                     subopt.order = { runWay: optask.subTaskRunWay };
    //                 }
    //             }
    //             subopt.name = ctx.subTaskName(subopt.name);
    //             // subopt.src = subopt.src || optask.src;
    //             // subopt.dist = subopt.dist || optask.dist;
    //         });
    //         return this.loadTasks(gulp, optask.tasks, ctx)
    //             .then(subseq => {
    //                 let taskname;
    //                 // if (optask.subTaskRunWay === RunWay.parallel) {
    //                 //     taskname = [flattenSequence(gulp, subseq, ctx, (name, runway) => ctx.subTaskName(name, (runway === RunWay.sequence ? '-subs' : '-subp')))]
    //                 // } else {
    //                 taskname = zipSequence(gulp, subseq, ctx, (name, runway) => ctx.subTaskName(name, (runway === RunWay.sequence ? '-sub-seq' : '-sub-paral')));
    //                 // }
    //                 if (taskname) {
    //                     return <ITaskInfo>{
    //                         order: optask.subTaskOrder,
    //                         taskName: taskname
    //                     };
    //                 } else {
    //                     return null;
    //                 }
    //             });
    //     } else {
    //         return Promise.resolve(null);
    //     }
    // }
}
