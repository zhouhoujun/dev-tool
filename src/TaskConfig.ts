import { Gulp, WatchEvent, WatchCallback } from 'gulp';

/**
 * project development build operation.
 * 
 * @export
 * @enum {number}
 */
export enum Operation {
    /**
     * build compile project.
     */
    build = 1 << 0,
    /**
     * test project.
     */
    test = 1 << 1,
    /**
     * e2e test project.
     */
    e2e = 1 << 2,
    /**
     * release project.
     */
    release = 1 << 3,
    /**
     * release and deploy project.
     */
    deploy = 1 << 4
}

/**
 * object map.
 * 
 * @export
 * @interface IMap
 * @template T
 */
export interface IMap<T> {
    [K: string]: T;
}

/**
 * src
 */
export type Src = string | string[];

/**
 * Task return type.
 * 
 * @export
 * @interface ITaskResult
 */
export interface ITaskResult {
    /**
     * task name for task sequence.
     * 
     * @type {Src}
     * @memberOf ITaskResult
     */
    name?: Src;
    /**
     * task Operation type. default all pperation.
     * 
     * @type {Operation}
     * @memberOf ITaskResult
     */
    oper?: Operation;
    /**
     * task sequence order.
     * 
     * @type {number}
     * @memberOf ITaskResult
     */
    order?: number;
}

export type TaskResult = Src | ITaskResult;
export type Task = (gulp: Gulp, config: TaskConfig) => TaskResult | TaskResult[] | void;

/**
 * task decorator annations.
 * 
 * @export
 * @param {Function} constructor
 */
export function task(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
/**
 * task loader option.
 * 
 * @export
 * @interface LoaderOption
 */
export interface LoaderOption {
    /**
     * loader type, default module.
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    type?: string;
    /**
     * module name or url
     * 
     * @type {string | Object}
     * @memberOf LoaderOption
     */
    module?: string | Object;

    /**
     * config module name or url.
     * 
     * @type {string | Object}
     * @memberOf LoaderOption
     */
    configModule?: string | Object;

    /**
     * config module name or url.
     * 
     * @type {string | Object}
     * @memberOf LoaderOption
     */
    taskModule?: string | Object;

    /**
     * task define.
     * 
     * @type {ITaskDefine}
     * @memberOf LoaderOption
     */
    taskDefine?: ITaskDefine;

    /**
     * custom external judage the object is right task func.
     * 
     * @param {*} mdl
     * @param {string} name
     * @returns {boolean}
     * 
     * @memberOf LoaderOption
     */
    isTaskFunc?(mdl: any): boolean;
    /**
     * custom external judage the object is right task define.
     * 
     * @param {*} mdl
     * @returns {boolean}
     * 
     * @memberOf LoaderOption
     */
    isTaskDefine?(mdl: any): boolean;
}

/**
 * loader to load tasks from directory.
 * 
 * @export
 * @interface DirLoaderOption
 * @extends {LoaderOption}
 */
export interface DirLoaderOption extends LoaderOption {
    /**
     * loader dir
     * 
     * @type {Src}
     * @memberOf LoaderOption
     */
    dir?: Src;
    /**
     * config in directory. 
     * 
     * @type {string}
     * @memberOf DirLoaderOption
     */
    dirConfigFile?: string;
}


/**
 * transform interface.
 * 
 * @export
 * @interface ITransform
 * @extends {NodeJS.ReadWriteStream}
 */
export interface ITransform extends NodeJS.ReadWriteStream {
    /**
     * transform pipe
     * 
     * @param {NodeJS.ReadWriteStream} stream
     * @returns {ITransform}
     * 
     * @memberOf ITransform
     */
    pipe(stream: NodeJS.ReadWriteStream): ITransform;
}

/**
 * output transform. support typescript output.
 * 
 * @export
 * @interface Output
 * @extends {ITransform}
 */
export interface Output extends ITransform {
    dts?: ITransform;
    js?: ITransform
}

export type Pipe = (config?: TaskConfig, dt?: DynamicTask,  gulp?: Gulp) => ITransform | Promise<ITransform>;

export type OutputPipe = (map: Output, config?: TaskConfig, dt?: DynamicTask,  gulp?: Gulp) => ITransform | Promise<ITransform>;

export interface OutputDist {
    /**
     * the src file filter string. default 'src'.
     * 
     * @type {string}
     * @memberOf OutputDist
     */
    src?: Src;

    /**
     * default output folder. if empty use parent setting, or ues 'dist'.
     */
    dist?: string;
    /**
     * build output folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Dist
     */
    build?: string;
    /**
     * test output folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Dist
     */
    test?: string;
    /**
     * e2e output folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Dist
     */
    e2e?: string;
    /**
     * release output folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Dist
     */
    release?: string;
    /**
     * deploy output folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Dist
     */
    deploy?: string;
}


/**
 * dynamic gulp task.
 * 
 * @export
 * @interface DynamicTask
 * @extends {OutputDist}
 */
export interface DynamicTask extends OutputDist {
    /**
     * task name
     * 
     * @type {string}
     * @memberOf DynamicTask
     */
    name: string;
    /**
     * task order.
     * 
     * @type {number}
     * @memberOf DynamicTask
     */
    order?: number;
    /**
     * task type. default for all Operation.
     * 
     * @type {Operation}
     * @memberOf DynamicTask
     */
    oper?: Operation;

    /**
     * watch tasks
     * 
     * 
     * @memberOf DynamicTask
     */
    watch?: Array<string | WatchCallback> | ((config?: TaskConfig, dt?: DynamicTask) => Array<string | WatchCallback>);
    /**
     * watch changed.
     * 
     * @param {WatchEvent} event
     * @param {TaskConfig} config
     * 
     * @memberOf DynamicTask
     */
    watchChanged?(event: WatchEvent, config: TaskConfig);
    /**
     * stream pipe.
     * 
     * @param {ITransform} gulpsrc
     * @param {TaskConfig} config
     * @returns {(ITransform | Promise<ITransform>)}
     * 
     * @memberOf DynamicTask
     */
    pipe?(gulpsrc: ITransform, config: TaskConfig, dt?: DynamicTask): ITransform | Promise<ITransform>;

    /**
     * task pipe works.
     * 
     * 
     * @memberOf DynamicTask
     */
    pipes?: Pipe[] | ((config?: TaskConfig, dt?: DynamicTask) => Pipe[]);

    /**
     * output pipe task
     *
     * 
     * @memberOf DynamicTask
     */
    output?: OutputPipe[] | ((config?: TaskConfig, dt?: DynamicTask) => OutputPipe[]);

    /**
     * custom task.
     * 
     * @param {TaskConfig} config
     * @param {DynamicTask} [dt]
     * @param {Gulp} [gulp]
     * @returns {(void | ITransform | Promise<any>)}
     * 
     * @memberOf DynamicTask
     */
    task?(config: TaskConfig, dt?: DynamicTask, gulp?: Gulp): void | ITransform | Promise<any>;

}

/**
 * the option for loader dynamic build task.
 * 
 * @export
 * @interface DynamicLoaderOption
 * @extends {LoaderOption}
 */
export interface DynamicLoaderOption extends LoaderOption {
    /**
     * dynamic task
     * 
     * @type {(DynamicTask | DynamicTask[])}
     * @memberOf DynamicLoaderOption
     */
    dynamicTasks?: DynamicTask | DynamicTask[];
}


/**
 * task loader option.
 * 
 * @export
 * @interface TaskLoaderOption
 */
export interface TaskLoaderOption {
    /**
     * task loader
     * 
     * @type {(string | LoaderOption | DynamicTask | DynamicTask[])}
     * @memberOf TaskOption
     */
    loader: string | LoaderOption | DynamicTask | DynamicTask[];

    /**
     * external task for 
     * 
     * @memberOf TaskConfig
     */
    externalTask?: Task;
    /**
     * custom set run tasks sequence.
     * 
     * 
     * @memberOf TaskConfig
     */
    runTasks?: Src[] | ((oper: Operation, tasks: Src[], subGroupTask?: TaskResult, assertsTask?: TaskResult) => Src[]);

    /**
     * sub tasks.
     * 
     * @type {(TaskOption | TaskOption[])}
     * @memberOf TaskOption
     */
    tasks?: TaskOption | TaskOption[];

    /**
     * set sub task order in this task sequence.
     * 
     * @type {number}
     * @memberOf TaskLoaderOption
     */
    subTaskOrder?: number;
}


/**
 * asserts to be dealt with.
 * 
 * @export
 * @interface Asserts
 */
export interface Asserts extends OutputDist, TaskLoaderOption {
    /**
     * asserts extends name. for register dynamic task.
     * 
     * @type {string}
     * @memberOf Asserts
     */
    name?: string;

    /**
     * tasks to deal with asserts.
     * 
     * @type {IMap<Src | Asserts, DynamicTask[]>}
     * @memberOf Asserts
     */
    asserts?: IMap<Src | Asserts | DynamicTask[]>;

    /**
     * set asserts task order in this task sequence.
     * 
     * @type {number}
     * @memberOf Asserts
     */
    assertsOrder?: number;
}


/**
 * task option setting.
 * 
 * @export
 * @interface TaskOption
 */
export interface TaskOption extends Asserts {
    /**
     * the src file filter string. default 'src'.
     * 
     * @type {string}
     * @memberOf TaskOption
     */
    src: Src;
}

/**
 * modules task define
 * 
 * @export
 * @interface ITaskDefine
 */
export interface ITaskDefine {
    /**
     * load config in modules
     * 
     * @param {Operation} oper
     * @param {TaskOption} option
     * @returns {TaskConfig}
     * 
     * @memberOf ITaskDefine
     */
    moduleTaskConfig(oper: Operation, option: TaskOption, env: EnvOption): TaskConfig

    /**
     * load task in modules.
     * 
     * @param {TaskConfig} config
     * @param {tasksInModule} findInModule
     * @param {tasksInDir} findInDir
     * @returns {Task[]}
     * 
     * @memberOf ITaskDefine
     */
    moduleTaskLoader?(config: TaskConfig): Promise<Task[]>;
}

// export interface TaskUtil {
//     files(directory: string, express?: ((fileName: string) => boolean)): string[];
//     gulpSrc(directory: string, expresion: Src): Src;
// }

/**
 * run time task config for setup task.
 * 
 * @export
 * @interface TaskConfig
 */
export interface TaskConfig {
    /**
     * custom global data cache.
     */
    globals?: any;
    /**
     * env
     * 
     * @type {EnvOption}
     * @memberOf TaskConfig
     */
    env: EnvOption;
    /**
     * run operation
     * 
     * @type {Operation}
     * @memberOf TaskConfig
     */
    oper: Operation;
    /**
     * task option setting.
     * 
     * @type {TaskOption}
     * @memberOf TaskConfig
     */
    option: TaskOption;

    /**
     * custom config run tasks sequence in.
     * 
     * @param {TaskResult} [subGroupTask]
     * @param {Src[]} [tasks]
     * @param {TaskResult} [assertTasks]
     * @returns {Src[]}
     * 
     * @memberOf TaskConfig
     */
    runTasks?(subGroupTask?: TaskResult, tasks?: Src[], assertTasks?: TaskResult): Src[];
    /**
     * custom print help.
     * 
     * @param {string} lang
     * 
     * @memberOf TaskConfig
     */
    printHelp?(lang: string): void;

    /**
     * find  task in module. default implement by loader.
     * 
     * @param {string} module
     * @returns {Promise<Task[]>}
     * 
     * @memberOf TaskConfig
     */
    findTasksInModule?(module: string): Promise<Task[]>;
    /**
     * find  task in directories. default implement by loader.
     * 
     * @param {Src} dirs
     * @returns {Promise<Task[]>}
     * 
     * @memberOf TaskConfig
     */
    findTasksInDir?(dirs: Src): Promise<Task[]>;

    /**
     * get dist of current state.  default implement in tools.
     * 
     * @param {OutputDist} dist
     * @returns {string}
     * 
     * @memberOf TaskConfig
     */
    getDist?(dist?: OutputDist): string;
    /**
     * filter file in directory.  default implement in tools.
     * 
     * @param {string} directory
     * @param {((fileName: string) => boolean)} [express]
     * @returns {string[]}
     * 
     * @memberOf TaskConfig
     */
    fileFilter?(directory: string, express?: ((fileName: string) => boolean)): string[];
    /**
     * filter file in directory.  default implement in tools.
     * 
     * @param {Gulp} gulp
     * @param {Src[]} tasks
     * @returns {Promise<any>}
     * 
     * @memberOf TaskConfig
     */
    runSequence?(gulp: Gulp, tasks: Src[]): Promise<any>;

    /**
     * dynamic register tasks.  default implement in tools.
     * 
     * @param {(DynamicTask | DynamicTask[])} tasks
     * @returns {Task[]}
     * 
     * @memberOf TaskConfig
     */
    dynamicTasks?(tasks: DynamicTask | DynamicTask[]): Task[];

    /**
     * add task result to task sequence.
     * 
     * @param {Src[]} sequence  task sequence.
     * @param {TaskResult} taskResult
     * @returns {Src[]}
     * 
     * @memberOf TaskConfig
     */
    addTask?(sequence: Src[], taskResult: TaskResult): Src[];
    /**
     * generate sub task name
     * 
     * @param {string} name
     * @param {string} [defaultName]
     * 
     * @memberOf TaskConfig
     */
    subTaskName?(name: string, defaultName?: string);
}

/**
 * event option
 * 
 * @export
 * @interface EnvOption
 */
export interface EnvOption {
    /**
     * project root.
     * 
     * @type {string}
     * @memberOf EnvOption
     */
    root?: string;
    /**
     * help doc
     * 
     * @type {(boolean | string)}
     * @memberOf EnvOption
     */
    help?: boolean | string;
    test?: boolean | string;
    serve?: boolean | string;
    e2e?: boolean | string;
    release?: boolean;
    deploy?: boolean;
    watch?: boolean | string;
    /**
     * run spruce task.
     */
    task?: string;

    /**
     * project config setting.
     * 
     * @type {string}
     * @memberOf EnvOption
     */
    config?: string;

    // key?: number;
    // value?: number;
    // csv?: string;
    // dist?: string;
    // lang?: string;

    publish?: boolean | string;

    /**
     * group bundle.
     * 
     * @type {Src}
     * @memberOf EnvOption
     */
    grp?: Src;
}
