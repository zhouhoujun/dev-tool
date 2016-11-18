import { ITask, IEnvOption, ITaskContext, bindingConfig } from 'development-core';
import { ITaskOption, customLoader } from '../TaskOption';
import { ITaskLoader } from '../ITaskLoader';

export class CustomLoader implements ITaskLoader {

    constructor(private option: ITaskOption, private loader: customLoader) {

    }

    load(context: ITaskContext): Promise<ITask[]> {
        return Promise.resolve(this.loader(context));
    }

    private condef: Promise<ITaskContext>;
    loadContext(env: IEnvOption): Promise<ITaskContext> {
        let self = this;
        this.condef = this.condef || Promise.resolve(
            bindingConfig({
                option: self.option,
                env: env
            }));

        return this.condef;
    }
}
