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

    /**
     * setup tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    setupTasks(): Promise<Src[]> {
        return this.loaderFactory.create(this)
            .load()
            .then(tsq => {
                return super.setupTasks();
            });
    }

}
