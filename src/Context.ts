import {
    ITaskContext, TaskContext, ITaskConfig, IAssertOption, Src, ITask, IDynamicTaskOption, Operation, RunWay, Builder
} from 'development-core';
import * as _ from 'lodash';
import { TaskCallback } from 'gulp';
import { IContext } from './IContext';
import { ITaskOption, TaskOption } from './TaskOption';
import { ILoaderFactory, LoaderFactory } from './loaderFactory';
import { ContextBuilder } from './Builder'


const factory = new LoaderFactory();
const builder = new ContextBuilder();

/**
* create Context instance.
*
* @static
* @param {(ITaskConfig | TaskOption)} cfg
* @param {IContext} [parent]
* @returns {IContext}
* @memberof Context
*/
export function createConextInstance(cfg: ITaskConfig | TaskOption, parent?: IContext): IContext {
    let config: ITaskConfig = (cfg['option'] ? cfg : { option: cfg }) as ITaskConfig;
    return new Context(config, parent);
}

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
        this._builder = builder;
    }

    private loading = false;
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
     * @param {ITaskContext} [parent] default current context.
     * @returns {ITaskContext}
     * @memberof TaskContext
     */
    createContext(cfg: ITaskConfig | IAssertOption, parent?: ITaskContext): ITaskContext {
        return createConextInstance(cfg, _.isUndefined(parent) ? this : parent as IContext);
    }

    addTask(...task: ITask[]) {
        if (this.loading) {
            super.addTask(...task);
            return;
        }

        this.getLoaderTasks()
            .then(tasks => {
                super.addTask(...task);
            });

    }

    removeTask(task: ITask): ITask[] | Promise<ITask[]> {
        if (this.loading) {
            return super.removeTask(task);
        }

        return this.getLoaderTasks()
            .then(tasks => {
                return super.removeTask(task);
            });

    }

    private _loaderTasks: Promise<ITask[]>;
    protected getLoaderTasks(): Promise<ITask[]> {
        if (!this._loaderTasks) {
            this.loading = true;
            this._loaderTasks = this.loaderFactory.create(this)
                .load()
                .then(tks => {
                    this.loading = false;
                    return tks;
                }, err => {
                    this.loading = false;
                    console.log(err);
                    return null;
                });
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
            })
            .catch(err => {
                console.error(err);
                process.exit(1);
                return null;
            });
    }

    // todo: debug.
    // setup() {
    //     return super.setup()
    //         .then((data) => {
    //             console.log('task seq:', data);
    //             return data;
    //         })

    // }

    // run() {
    //     this.builder.build(this);
    //     return super.run();
    // }

    start(): Promise<Src[]> {
        let gulp = this.gulp;
        let isRoot = !this.parent;
        let btsk = isRoot ? 'build' : `build-${this.toStr(this.option.name)}`;
        gulp.task(btsk, (callback: TaskCallback) => {
            return this.run();
        });

        gulp.task(isRoot ? 'start' : `start-${this.toStr(this.option.name)}`, (callback: TaskCallback) => {
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
