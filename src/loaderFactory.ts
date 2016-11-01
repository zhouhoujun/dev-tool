import { ITaskLoader } from './ITaskLoader';
import { DirLoader } from './loaders/DirLoader';
import { ITaskOption, ILoaderOption, IDynamicLoaderOption } from 'development-core';
import { ModuleLoader } from './loaders/ModuleLoader';
import { DynamicLoader } from './loaders/DynamicLoader';
import { CustomLoader } from './loaders/CustomLoader';
import * as _ from 'lodash';
/**
 * loader factory.
 * 
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    create(option: ITaskOption): ITaskLoader;
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
    create(option: ITaskOption): ITaskLoader {

        if (_.isString(option.loader)) {
            option.loader = {
                module: option.loader
            };
            return new ModuleLoader(option);
        } else if (_.isFunction(option.loader)) {
            return new CustomLoader(option, option.loader);
        } else if (_.isArray(option.loader)) {
            option.loader = <IDynamicLoaderOption>{
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
                option.loader = <IDynamicLoaderOption>{
                    dynamicTasks: option.loader
                };
                return new DynamicLoader(option);
            }

            // if config pipe and taskName.
            if (option.loader['dynamicTasks']) {
                return new DynamicLoader(option);
            }

            let loader: ITaskLoader = null;
            let loderOption: ILoaderOption = option.loader;
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
