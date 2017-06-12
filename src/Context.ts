import {
    TaskContext, zipSequence, ITaskConfig, Src, Operation,
    IEnvOption, ITaskContext, ITaskInfo, RunWay, IDynamicTaskOption, ITask, TaskResult
} from 'development-core';
import { IContext } from './IContext';
import * as _ from 'lodash';
import * as gulp from 'gulp';
import { Gulp, TaskCallback } from 'gulp';
import { TaskOption, IAssertOption } from './TaskOption';
import { ILoaderFactory, LoaderFactory } from './loaderFactory';


const factory = new LoaderFactory();
/**
 * Context.
 * 
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
export class Context extends TaskContext implements IContext {

    private _gulp: Gulp;
    get gulp() {
        return this._gulp || gulp;
    }
    set gulp(gulp: Gulp) {
        this._gulp = gulp;
    }
    // private children: IContext[] = [];
    constructor(cfg: ITaskConfig, parent?: IContext) {
        super(cfg, parent);
    }

    private __factory: ILoaderFactory;
    get factory(): ILoaderFactory {
        return this.__factory || factory;
    }

    set factory(fac: ILoaderFactory) {
        this.__factory = fac;
    }

    /**
     * load tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    loadTasks(): Promise<Src[]> {
        this.each((ctx: IContext) => {

            ctx.loadAssertTasks();

        });
        return Promise.all<Src[]>(
            this.children.map((ctx: IContext) => {
                let isContext = ctx instanceof Context;
                return Promise.all([
                    this.findTasks()
                    isContext? ctx.loadAssertTasks() : [],
                    isContext ? ctx.loadTasks() : []
                ])
                    .then(src => {

                    })
            })
        )
            .then(srcs => {

            });

    }

    /**
     * load asserts tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    loadAssertTasks(): Promise<Src[]> {
        let optask = <IAssertOption>this.option;

        let assertOrder = this.to(optask.assertsOrder);
        if (!_.isNumber(assertOrder) && assertOrder) {
            optask.assertsRunWay = optask.assertsRunWay || assertOrder.runWay;
        }
        optask.assertsRunWay = optask.assertsRunWay || RunWay.parallel;

        if (optask.asserts) {
            let tasks: IAssertOption[] = [];

            _.mapKeys(optask.asserts, (sr, name) => {
                let op: IAssertOption;
                // let sr = optask.asserts[name];
                if (_.isString(sr)) {
                    op = <IAssertOption>{ src: sr };
                } else if (_.isNumber(sr)) {
                    // watch with Operation.autoWatch.
                    op = <IAssertOption>{ loader: [{ oper: sr, name: name, pipes: [] }] };
                } else if (_.isFunction(sr)) {
                    op = { loader: sr };
                } else if (_.isArray(sr)) {
                    if (sr.length > 0) {
                        if (!_.some(<string[]>sr, it => !_.isString(it))) {
                            op = <IAssertOption>{ src: <string[]>sr };
                        } else {
                            op = <IAssertOption>{ loader: <IDynamicTaskOption[]>sr, watch: true };
                        }
                    }
                } else {
                    op = sr;
                }

                if (_.isNull(op) || _.isUndefined(op)) {
                    return;
                }
                if (!op.loader) {
                    op.loader = [{ name: name, pipes: [], watch: true }]
                }
                op.name = op.name || this.subTaskName(name);
                op.src = op.src || (this.getSrc({ oper: Operation.default }) + '/**/*.' + name);
                // op.dist = op.dist || ctx.getDist({ oper: Operation.build });
                if (!op.order) {
                    if (optask.assertsRunWay) {
                        op.order = { runWay: optask.assertsRunWay };
                    } else if (!_.isNumber(assertOrder)) {
                        op.order = { runWay: assertOrder.runWay };
                    }
                }
                tasks.push(op);
            });


            return this.loadTasks(tasks, ctx)
                .then(tseq => {
                    let taskname;
                    taskname = zipSequence(gulp, tseq, ctx, (name, runway) => name + (runway === RunWay.sequence ? '-asserts-seq' : '-assert-paral'));

                    return <ITaskInfo>{
                        order: optask.assertsOrder,
                        taskName: taskname
                    }
                });
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * run task in this context.
     *
     * @param {IEnvOption} env
     * @returns {Promise<any>}
     *
     * @memberof IContext
     */
    run(env: IEnvOption): Promise<any> {
        return null;
    }



}
