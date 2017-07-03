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

// /**
// * create Context instance.
// *
// * @static
// * @param {(ITaskConfig | TaskOption)} cfg
// * @param {IContext} [parent]
// * @returns {IContext}
// * @memberof Context
// */
// export function createConextInstance(cfg: ITaskConfig | TaskOption, parent?: IContext): IContext {
//     let config: ITaskConfig = (cfg['option'] ? cfg : { option: cfg }) as ITaskConfig;
//     return parent? parent.add(cfg) : new Context(config, parent);
// }

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
        this._builder = builder;
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
