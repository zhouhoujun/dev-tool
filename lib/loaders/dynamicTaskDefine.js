"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(e){return{loadConfig:function(e,n,o){return{oper:e,env:o,option:n}},loadTasks:function(n){var o=n.option.loader,t=[];return o.dynamicTasks&&(t=n.generateTask(o.dynamicTasks)),e?(console.log(e),n.findTasks(e).then(function(e){return e=e||[],t&&(e=e.concat(t)),e})):t?Promise.resolve(t):Promise.reject("can not find tasks!")}}};
//# sourceMappingURL=../sourcemaps/loaders/dynamicTaskDefine.js.map