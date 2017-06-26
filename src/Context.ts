import {
    TaskContext, ITaskConfig, Src, ITask, ITaskInfo, Operation, Mode, IEnvOption, RunWay, sortOrder
} from 'development-core';
import { IContext } from './IContext';
import * as _ from 'lodash';
// import { ITaskOption } from './TaskOption';
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


    addTask(...task: ITask[]) {
        this.getLoaderTasks()
            .then(tasks => {
                super.addTask(...task);
            });
    }

    removeTask(task: ITask): ITask[] | Promise<ITask[]> {
        return this.getLoaderTasks()
            .then(tasks => {
                return super.removeTask(task);
            });
    }

    private _loaderTasks: Promise<ITask[]>;
    protected getLoaderTasks(): Promise<ITask[]> {
        if (!this._loaderTasks) {
            this._loaderTasks = this.loaderFactory.create(this)
                .load();
        }
        return this._loaderTasks
    }
    /**
     * setup tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    setupTasks(): Promise<Src[]> {
        return this.getLoaderTasks()
            .then(tsq => {
                return super.setupTasks();
            });
    }

}
