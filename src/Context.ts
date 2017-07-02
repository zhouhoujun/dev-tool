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

    start(): Promise<Src[]> {
        let gulp = this.gulp;
        let isRoot = !this.parent;
        let btsk = isRoot ? 'build' : `build-${this.taskName(this.toStr(this.option.name))}`;
        gulp.task(btsk, (callback: TaskCallback) => {
            return this.run();
        });

        gulp.task(isRoot ? 'start' : `start-${this.taskName(this.toStr(this.option.name))}`, (callback: TaskCallback) => {
            if (!this.env.task) {
                return Promise.reject('start task can not empty!');
            }
            let tasks = this.env.task.split(',');
            return this.find<Context>(ctx => tasks.indexOf(ctx.toStr(ctx.option.name)) >= 0)
                .run();
        });

        if (!this.parent) {
            gulp.task('default', () => {
                gulp.start(btsk);
            });
        }

        return Promise.resolve([btsk]);
    }

}
