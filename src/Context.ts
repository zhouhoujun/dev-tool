import {
    ITaskContext, TaskContext, ITaskConfig, IAssertOption, Src, ITask, IDynamicTaskOption, Operation, RunWay, Builder
} from 'development-core';
import * as _ from 'lodash';
import { TaskCallback } from 'gulp';
import { IContext } from './IContext';
import { ITaskOption, TaskOption } from './TaskOption';
import { ITaskLoader } from './ITaskLoader';
import { ILoaderFactory, LoaderFactory } from './loaderFactory';
import { ContextBuilder } from './Builder'


const factory = new LoaderFactory();
const builder = new ContextBuilder();

/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
export class Context extends TaskContext implements IContext {

    constructor(cfg: ITaskConfig) {
        super(cfg);
        this.builder = builder;
    }

    private _loaderfactory: ILoaderFactory;
    get loaderFactory(): ILoaderFactory {
        return this._loaderfactory || factory;
    }

    set loaderFactory(fac: ILoaderFactory) {
        this._loaderfactory = fac;
    }

    /**
     * create new context;
     *
     * @param {ITaskConfig} cfg
     * @returns {ITaskContext}
     * @memberof TaskContext
     */
    protected createContext(cfg: ITaskConfig): ITaskContext {
        return new Context(cfg);
    }

    private _loader: ITaskLoader;
    getLoader(): ITaskLoader {
        if (!this._loader) {
            this._loader = this.loaderFactory.create(this);
        }
        return this._loader;
    }

    // todo: debug.
    // setup() {
    //     if (!this.builder.isBuilt(this)) {
    //         this.builder.build(this);
    //     }
    //     return super.setup()
    //         .then((data) => {
    //             console.log('task seq:', data);
    //             return data;
    //         })
    // }
}
