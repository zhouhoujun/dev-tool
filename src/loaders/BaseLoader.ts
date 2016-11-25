import { ITask, IEnvOption, IContextDefine, ITaskContext, ITaskConfig } from 'development-core';
import { ITaskOption, ILoaderOption } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';


export abstract class BaseLoader implements ITaskLoader {

    constructor(protected option: ITaskOption, protected env?: IEnvOption, protected factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext) {

    }

    load(context: IContext): Promise<ITask[]> {
        return this.contextDef
            .then(def => {
                return this.loadTasks(context, def);
            })
            .catch(err => {
                console.error(err);
            });
    }

    loadContext(env: IEnvOption): Promise<IContext> {
        this.env = env;
        let self = this;
        return this.contextDef
            .then(def => {
                return <IContext>def.getContext({
                    option: self.option,
                    env: env,
                    createContext: self.factory
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
