import { ITask, IEnvOption, IContextDefine, ITaskContext, ITaskOption, ILoaderOption } from 'development-core';
import { ITaskLoader } from '../ITaskLoader';


export abstract class BaseLoader implements ITaskLoader {

    protected option: ITaskOption;
    constructor(option: ITaskOption) {
        this.option = option;
    }

    load(context: ITaskContext): Promise<ITask[]> {
        return this.contextDef
            .then(def => {
                return this.loadTasks(context, def);
            })
            .catch(err => {
                console.error(err);
            });
    }

    loadContext(env: IEnvOption): Promise<ITaskContext> {
        let self = this;
        return this.contextDef
            .then(def => {
                return def.getContext({
                    option: self.option,
                    env: env
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    private _contextDef: Promise<IContextDefine>;
    protected get contextDef(): Promise<IContextDefine> {
        if (!this._contextDef) {
            this._contextDef = Promise.resolve(this.getContextDefine());
        }

        return this._contextDef;
    }


    protected loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]> {
        if (def.tasks) {
            return def.tasks(context);
        } else {
            let mdl = this.getTaskModule();
            return context.findTasks(mdl);
        }
    }

    protected abstract getContextDefine(): IContextDefine | Promise<IContextDefine>;

    protected getConfigModule(): string | Object {
        let loader: ILoaderOption = this.option.loader;
        return loader.configModule || loader.module;
    }

    protected getTaskModule(): string | Object {
        let loader: ILoaderOption = this.option.loader;
        return loader.taskModule || loader.module;
    }
}
