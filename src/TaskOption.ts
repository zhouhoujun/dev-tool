import {
    Order, IPipeOption, ICustomPipe, ITaskDefine, ITask, IAsserts, RunWay
    , IContextDefine, TaskSource, IDynamicTaskOption, ITaskContext, ITaskConfig
} from 'development-core'


export type contextFactory = (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext;
/**
 * task loader option.
 * 
 * @export
 * @interface ILoaderOption
 * @extends {IPipeOption}
 */
export interface ILoaderOption extends IPipeOption, ICustomPipe {

    /**
     * loader type, default module.
     * 
     * @type {string}
     * @memberOf ILoaderOption
     */
    type?: string;
    /**
     * module name or url
     * 
     * @type {string | Object}
     * @memberOf ILoaderOption
     */
    module?: string | Object;

    /**
     * config module name or url.
     * 
     * @type {string | Object}
     * @memberOf ILoaderOption
     */
    configModule?: string | Object;

    /**
     * config module name or url.
     * 
     * @type {string | Object}
     * @memberOf ILoaderOption
     */
    taskModule?: string | Object;

    /**
     * custom task define
     * 
     * 
     * @memberOf ILoaderOption
     */
    taskDefine?: ITaskDefine;

    /**
     * context define.
     * 
     * @type {IContextDefine}
     * @memberOf ILoaderOption
     */
    contextDefine?: IContextDefine;
}

/**
 * loader to load tasks from directory.
 * 
 * @export
 * @interface DirLoaderOption
 * @extends {ILoaderOption}
 */
export interface IDirLoaderOption extends ILoaderOption {
    /**
     * loader dir
     * 
     * @type {TaskSource}
     * @memberOf ILoaderOption
     */
    dir?: TaskSource
    /**
     * config in directory. 
     * 
     * @type {string}
     * @memberOf DirLoaderOption
     */
    dirConfigFile?: string;
}

/**
 * sub task option.
 * 
 * @export
 * @interface ISubTaskOption
 */
export interface ISubTaskOption {
    /**
     * sub tasks.
     * 
     * @type {TaskOption}
     * @memberOf ISubTaskOption
     */
    tasks?: TaskOption;

    /**
     * set sub task order in this task sequence.
     * 
     * @type {Order}
     * @memberOf ISubTaskOption
     */
    subTaskOrder?: Order;
    /**
     * sub tasks run way. default RunWay.sequence
     * 
     * @type {RunWay}
     * @memberOf ISubTaskOption
     */
    subTaskRunWay?: RunWay

}

/**
 * the option for loader dynamic build task.
 * 
 * @export
 * @interface IDynamicLoaderOption
 * @extends {ILoaderOption}
 */
export interface IDynamicLoaderOption extends ILoaderOption {
    /**
     * dynamic task
     * 
     * @type {(IDynamicTaskOption | IDynamicTaskOption[])}
     * @memberOf IDynamicLoaderOption
     */
    dynamicTasks?: IDynamicTaskOption | IDynamicTaskOption[];
}


export type customLoader = (context: ITaskContext) => ITask[] | Promise<ITask[]>;

/**
 * task loader option.
 * 
 * @export
 * @interface TaskLoaderOption
 */
export interface ITaskLoaderOption {
    /**
     * task loader
     * 
     * @type {(string | customLoader | ILoaderOption | IDynamicTaskOption | IDynamicTaskOption[])}
     * @memberOf ITaskLoaderOption
     */
    loader?: string | customLoader | ILoaderOption | IDynamicTaskOption | IDynamicTaskOption[];

}

/**
 * assert option
 * 
 * @export
 * @interface IAssertOption
 * @extends {IAsserts}
 * @extends {ITaskLoaderOption}
 */
export interface IAssertOption extends IAsserts, ITaskLoaderOption {

    /**
     * asserts tasks run way. default RunWay.parallel
     * 
     * @type {RunWay}
     * @memberOf ISubTaskOption
     */
    assertsRunWay?: RunWay
}

/**
 * task option setting.
 * 
 * @export
 * @interface ITaskOption
 * @extends {IAssertOption}
 * @extends {ISubTaskOption}
 */
export interface ITaskOption extends IAssertOption, ISubTaskOption {
    /**
     * the src file filter string. default 'src'.
     * 
     * @type {TaskSource}
     * @memberOf ITaskOption
     */
    src?: TaskSource;
}


/**
 * task option.
 */
export type TaskOption = ITaskOption | IAssertOption | IDynamicTaskOption | Array<ITaskOption | IAssertOption | IDynamicTaskOption>;
