import merge from 'lodash/merge.js';

import * as healthcheck from './healthcheck.js';

import * as Path from './path/index.js';

import * as recommend from './recommend/index.js';

import * as gpt from './gpt/index.js';

const resolvers = merge({}, ...[healthcheck, Path, recommend, gpt]);

export default resolvers;
