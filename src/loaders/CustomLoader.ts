import { ITask, IEnvOption, ITaskContext, bindingConfig, ITaskConfig } from 'development-core';
import { ITaskOption, customLoader } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';

export class CustomLoader implements ITaskLoader {

    constructor(private option: ITaskOption, private loader: customLoader, private factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext) {

    }

    load(context: ITaskContext): Promise<ITask[]> {
        return Promise.resolve(this.loader(context));
    }

    private condef: Promise<IContext>;
    loadContext(env: IEnvOption): Promise<IContext> {
        let self = this;
        this.condef = this.condef || Promise.resolve(
            <IContext>bindingConfig({
                option: self.option,
                env: env,
                createContext: self.factory
            }));

        return this.condef;
    }
}
