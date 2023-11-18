import merge from 'lodash/merge.js';

import * as healthcheck from './healthcheck.js';

import * as Path from './path/index.js';

const resolvers = merge({}, ...[healthcheck, Path]);

export default resolvers;
