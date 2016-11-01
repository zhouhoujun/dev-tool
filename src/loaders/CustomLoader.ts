import { ITask, customLoader, Operation, IEnvOption, ITaskOption, ITaskDefine, bindingConfig, ITaskConfig } from 'development-core';
import { ITaskLoader } from '../ITaskLoader';

export class CustomLoader implements ITaskLoader {

    constructor(private option: ITaskOption, private loader: customLoader) {
    }

    load(cfg: ITaskConfig): Promise<ITask[]> {
        return Promise.resolve(this.loader(cfg))
    }

    loadConfg(oper: Operation, env: IEnvOption): Promise<ITaskConfig> {
        let self = this;
        return Promise.resolve({
            option: self.option,
            env: env,
            oper: oper
        })
            .then(config => {
                return bindingConfig(config);
            });
    }
    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = {
            loadConfig(oper: Operation, option: ITaskOption, env: IEnvOption): ITaskConfig {
                return {
                    oper: oper,
                    env: env,
                    option: option
                }
            },
        }

        return Promise.resolve(tsdef);
    }
}


