
import { IAsserts } from 'development-core';


export interface NodeTaskOption extends IAsserts {
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
