import { ITask, ITaskDefine, IContextDefine, ITaskContext } from 'development-core';
import { ITaskOption } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';
import { ILoaderOption } from '../ILoaderOption';


/**
 * base loader.
 *
 * @export
 * @abstract
 * @class BaseLoader
 * @implements {ITaskLoader}
 */
export abstract class BaseLoader implements ITaskLoader {

    name = 'base';

    constructor(protected ctx: IContext) {
    }

    get option(): ITaskOption {
        return this.ctx.option as ITaskOption;
    }

    private _tasks: Promise<ITask[]>;
    load(): Promise<ITask[]> {
        if (!this._tasks) {
            this._tasks = this.taskDef
                .then((def) => {
                    if (def.loadConfig) {
                        this.ctx.setConfig(def.loadConfig(this.ctx.option, this.ctx.env));
                    }
                    if (def['getContext']) {
                        let cdef = def as IContextDefine;
                        let customCtx = cdef.getContext(this.ctx.getConfig());
                        this.ctx.setConfig(customCtx.getConfig());
                    }
                    if (def['setContext']) {
                        let cdef = def as IContextDefine;
                        cdef.setContext(this.ctx);
                    }
                    return def;
                })
                .then(def => {
                    return this.loadTasks(this.ctx, def);
                })
                .catch(err => {
                    console.error(err);
                    return null;
                });
        }
        return this._tasks;
    }

    private _taskDef: Promise<ITaskDefine>;
    protected get taskDef(): Promise<ITaskDefine> {
        if (!this._taskDef) {
            this._taskDef = Promise.resolve(this.loadTaskDefine());
        }

        return this._taskDef;
    }


    protected loadTasks(context: ITaskContext, def: ITaskDefine): Promise<ITask[]> {
        def = def || {};
        if (def.tasks) {
            return def.tasks(context);
        } else if (def.loadTasks) {
            return def.loadTasks(context);
        } else {
            let mdl = this.getTaskModule();
            return context.findTasks(mdl);
        }
    }

    protected abstract loadTaskDefine(): ITaskDefine | Promise<ITaskDefine>;

    protected getConfigModule(): string | Object {
        let loader: ILoaderOption = this.option.loader as ILoaderOption;
        return loader.configModule || loader.module;
    }

    protected getTaskModule(): string | Object {
        let loader: ILoaderOption = this.option.loader as ILoaderOption;
        return loader.taskModule || loader.module;
    }
}
