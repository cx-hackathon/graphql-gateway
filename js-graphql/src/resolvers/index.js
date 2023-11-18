import merge from 'lodash/merge.js';

import * as healthcheck from './healthcheck.js';

import * as Path from './path/index.js';

import * as recommend from './recommend/index.js';

const resolvers = merge({}, ...[healthcheck, Path, recommend]);

export default resolvers;
