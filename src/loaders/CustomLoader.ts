import { ITask, IEnvOption, ITaskContext, bindingConfig } from 'development-core';
import { ITaskOption, customLoader, IContext } from '../TaskOption';
import { ITaskLoader } from '../ITaskLoader';

export class CustomLoader implements ITaskLoader {

    constructor(private option: ITaskOption, private loader: customLoader) {

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
                env: env
            }));

        return this.condef;
    }
}
