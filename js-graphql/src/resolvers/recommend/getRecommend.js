import * as dotenv from 'dotenv';
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

dotenv.config();

const RECOMMEND_TABLE = process.env.RECOMMEND_TABLE;
const REGION = process.env.REGION;

const client = new DynamoDBClient({ region: REGION });

export const getRecommend = async (p) => {
  const email = p.email;
  const topK = 3;
  const params = {
    TableName: RECOMMEND_TABLE,
    Key: {
      userId: { S: email },
    },
  };
  const command = new GetItemCommand(params);
  const data = await client.send(command);

  // AI Recommendation System, Accept HFRL
  let preferences = Object.keys(data.Item)
    .filter((key) => key !== 'userId')
    .map((key) => {
      return {
        type: key,
        count: data.Item[key].N,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, topK);
  const totalCount = preferences.reduce((sum, cur) => sum + Number(cur.count), 0);
  preferences = preferences.map((preference) => {
    return { probability: preference.count / totalCount, ...preference };
  });
  console.log(preferences);
  let selection = Math.random();
  for (let i = 0; i < preferences.length; i++) {
    if (selection <= preferences[i].probability) return preferences[i];
    selection -= preferences[i].probability;
  }
  return preferences[preferences.length - 1];
};
