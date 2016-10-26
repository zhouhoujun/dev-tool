
import { TaskOption } from '../../src/tools';


export interface NodeTaskOption extends TaskOption {
    /**
     * tsconfig for typescript
     * 
     * @type {string}
     * @memberOf NodeTaskOption
     */
    tsconfig?: string;

    tsBabelOption?: any;
    /**
     * mocha test config.
     * 
     * @type {MochaSetupOptions}
     * @memberOf NodeTaskOption
     */
    mochaOptions?: MochaSetupOptions;
}

/**
 * unused. please use NodeTaskOption
 * 
 * @export
 * @interface NodeBuildOption
 * @extends {NodeTaskOption}
 */
export interface NodeBuildOption extends NodeTaskOption {

}
