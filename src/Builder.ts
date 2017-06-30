import {
    ITaskContext, IMap, IAsserts, TaskContext, ITaskConfig, Src, ITask, IDynamicTaskOption, Operation, RunWay, Builder
} from 'development-core';
import * as _ from 'lodash';
import { TaskCallback } from 'gulp';
import { IContext } from './IContext';
import { ITaskOption, TaskOption } from './TaskOption';
import { ILoaderFactory, LoaderFactory } from './loaderFactory';
import { Context } from './Context';


export class ContextBuilder implements Builder {

    /**
     * build context component.
     *
     * @protected
     * @memberof Development
     */
    build<T extends IAsserts>(node: ITaskContext, option?: T): ITaskContext {
        option ? this.buildContexts(node as IContext, option) : this.buildContext(node as IContext);
        node['__built'] = true;
        return node;
    }


    /**
     * is built or not.
     *
     * @param {ITaskContext} node
     * @returns {boolean}
     * @memberof ContextBuilder
     */
    isBuilt(node: ITaskContext): boolean {
        return node && node['__built'];
    }

    clean(node: ITaskContext) {
        if (node) {
            node['__built'] = undefined;
        }
    }

    protected buildContext(node: IContext) {
        let optask = node.option as ITaskOption;
        if (optask.asserts) {
            let assertctx = node.add(<ITaskOption>{ name: 'asserts', loader: [], order: optask.assertsOrder }) as IContext;
            let asserts = optask.asserts;
            optask.asserts = null;
            this.buildAssertContext(assertctx, asserts, optask.assertsRunWay);
        }
        if (optask.tasks) {
            this.buildSubContext(node);
        }
    }

    protected buildContexts(parent: IContext, taskOptions: TaskOption) {
        let tasks: ITaskOption[] = _.isArray(taskOptions) ? taskOptions : [taskOptions];
        tasks.forEach(optask => {
            if (optask.oper && parent.oper && (parent.oper & optask.oper) <= 0) {
                return;
            }
            let ctx: IContext = parent.add(optask) as IContext;
            ctx['__built'] = true;
            if (optask.asserts) {
                let assertctx = ctx.add(<ITaskOption>{ name: 'asserts', loader: [], order: optask.assertsOrder })  as IContext;
                assertctx['__built'] = true;
                let asserts = optask.asserts;
                optask.asserts = null;
                this.buildAssertContext(assertctx, asserts, optask.assertsRunWay);
            }
            if (optask.tasks) {
                this.buildSubContext(ctx);
            }
        });
    }

    /**
    * build asserts tasks.
    *
    * @protected
    * @param {ITaskContext} ctx
    *
    * @memberOf Builder
    */
    protected buildAssertContext(ctx: IContext, asserts: IMap<Operation | Src | IAsserts | IDynamicTaskOption[]>, runWay?: RunWay) {
        let tasks: ITaskOption[] = [];
        _.each(_.keys(asserts), name => {
            let op: ITaskOption;
            let sr = asserts[name];
            if (_.isString(sr)) {
                op = <ITaskOption>{ src: sr };
            } else if (_.isNumber(sr)) {
                // watch with Operation.autoWatch.
                op = <ITaskOption>{ loader: [{ oper: sr, name: name, pipes: [] }] };
            } else if (_.isFunction(sr)) {
                op = <ITaskOption>{ loader: sr };
            } else if (_.isArray(sr)) {
                if (sr.length > 0) {
                    if (!_.some(<string[]>sr, it => !_.isString(it))) {
                        op = <ITaskOption>{ src: <string[]>sr };
                    } else {
                        op = <ITaskOption>{ loader: <IDynamicTaskOption[]>sr, watch: true };
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
            op.name = op.name || name; // || ctx.taskName(name);
            op.src = op.src || (ctx.getSrc({ oper: Operation.default }) + '/**/*.' + name);
            // op.dist = op.dist || ctx.getDist({ oper: Operation.build });
            op.runWay = op.runWay || runWay || RunWay.parallel;
            tasks.push(op);
        });

        this.buildContexts(ctx, tasks);
    }
    /**
     * build sub context.
     *
     * @protected
     * @param {IContext} ctx
     *
     * @memberOf Builder
     */
    protected buildSubContext(ctx: IContext) {

        let optask = <ITaskOption>ctx.option;
        if (!optask.tasks) {
            return;
        }
        let tasks = _.isArray(optask.tasks) ? optask.tasks : [optask.tasks];
        // let idex = 0;
        let subtasks = tasks.map(subopt => {
            if (!subopt.order) {
                let subOrder = ctx.to(optask.subTaskOrder);
                if (!_.isNumber(subOrder) && subOrder) {
                    optask.order = optask.order || subOrder.runWay;
                } else if (optask.subTaskRunWay) {
                    subopt.order = { runWay: optask.subTaskRunWay };
                }
            }
            subopt.name = subopt.name || ctx.taskName(subopt.name); // ('sub' + idex++);
            return subopt;
        });

        this.buildContexts(ctx, subtasks);

    }
}
