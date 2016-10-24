import { ITaskLoader } from './ITaskLoader';
import { DirLoader } from './loaders/DirLoader';
import { TaskOption, LoaderOption, DynamicLoaderOption } from './TaskConfig';
import { ModuleLoader } from './loaders/ModuleLoader';
import { DynamicLoader } from './loaders/DynamicLoader';
import * as _ from 'lodash';
/**
 * loader factory.
 * 
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    create(option: TaskOption): ITaskLoader;
}


/**
 * loader factory.
 * 
 * @export
 * @class LoaderFactory
 * @implements {ILoaderFactory}
 */
export class LoaderFactory implements ILoaderFactory {

    constructor() {
    }
    create(option: TaskOption): ITaskLoader {

        if (_.isString(option.loader)) {
            option.loader = {
                module: option.loader
            };
            return new ModuleLoader(option);
        } else if (_.isArray(option.loader)) {
            option.loader = <DynamicLoaderOption>{
                dynamicTasks: option.loader
            };
            return new DynamicLoader(option);
        } else {
            // if config dir.
            if (option.loader['dir']) {
                return new DirLoader(option);
            }

            // dynamic task name.
            if (_.isString(option.loader['name'])) {
                option.loader = <DynamicLoaderOption>{
                    dynamicTasks: option.loader
                };
                return new DynamicLoader(option);
            }

            // if config pipe and taskName.
            if (option.loader['dynamicTasks']) {
                return new DynamicLoader(option);
            }

            let loader = null;
            let loderOption: LoaderOption = option.loader;
            switch (loderOption.type) {
                case 'dir':
                    loader = new DirLoader(option);
                    break;

                case 'dynamic':
                    loader = new DynamicLoader(option);
                    break;

                case 'module':
                default:
                    loader = new ModuleLoader(option);
                    break;
            }
            return loader;
        }
    }
}
