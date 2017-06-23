import {
    TaskContext, ITaskConfig, Src, ITask, ITaskInfo, Operation, Mode, IEnvOption, RunWay, sortOrder
} from 'development-core';
import { IContext } from './IContext';
import * as _ from 'lodash';
import { TaskSeq, ITaskOption } from './TaskOption';
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

    // private children: IContext[] = [];
    constructor(cfg: ITaskConfig, parent?: IContext) {
        super(cfg, parent);
    }

    private _loaderfactory: ILoaderFactory;
    get loaderFactory(): ILoaderFactory {
        return this._loaderfactory || factory;
    }

    set loaderFactory(fac: ILoaderFactory) {
        this._loaderfactory = fac;
    }

    /**
     * load tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    loadTasks(): Promise<Src[]> {
        let tasks = [];
        return Promise.all(
            tasks
                .concat(
                this.loadCurrTasks(),
                this.map((ctx: IContext) => {
                    return ctx.loadTasks()
                        .then(seq => <TaskSeq>{
                            opt: ctx.option,
                            seq: seq
                        });
                }, Mode.children)))
            .then(srcs => {
                let opt = this.option as ITaskOption;
                let tseq = srcs.shift() as Src[];
                let ordertask = sortOrder(srcs as TaskSeq[], itm => itm.opt.order, this);

                let subseq: Src[] = [];
                _.each(ordertask, (t, idx) => {
                    if (_.isArray(t)) {
                        subseq.push(_.filter(_.map(t, it => this.zipSequence(it.seq)), it => it));
                    } else {
                        let tk = this.zipSequence(t.seq);
                        if (tk) {
                            subseq.push(tk);
                        }
                    }
                });

                let children = this.zipSequence(subseq, (name, runway) => this.subTaskName(name, (runway === RunWay.sequence ? '-sub-seq' : '-sub-paral')));
                if (children) {
                    tseq = this.addToSequence(tseq, <ITaskInfo>{
                        order: opt.subTaskOrder,
                        taskName: children
                    })
                }

                return tseq;
            });

    }

    protected loadCurrTasks(): Promise<Src[]> {
        return this.loaderFactory.create(this)
            .load()
            .then(tsq => this.toSequence(tsq));
    }


    /**
     * run task in this context.
     *
     * @returns {Promise<any>}
     *
     * @memberof IContext
     */
    run(): Promise<any> {
        if (this.env.help) {
            return Promise.resolve(this.help())
        } else {
            return this.loadTasks()
                .then(tseq => {
                    let opt = this.option as ITaskOption;
                    if (opt.runWay === RunWay.parallel) {
                        return this.runSequence([this.flattenSequence(tseq)]);
                    } else {
                        return this.runSequence(tseq);
                    }
                });
        }
    }

    help() {
        this.cfg.printHelp && this.cfg.printHelp(_.isBoolean(this.env.help) ? '' : this.env.help);
    }



}
