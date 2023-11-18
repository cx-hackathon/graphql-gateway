import { putRecommend } from './putRecommend.js';
import { getRecommend } from './getRecommend.js';

export const Query = {
  user: (root, args, context) => {
    return { email: args.email };
  },
};

export const Mutation = {
  addPreference: putRecommend,
};

export const User = {
  preferences: getRecommend,
};
