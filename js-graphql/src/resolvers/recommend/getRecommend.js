import * as dotenv from 'dotenv';
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

dotenv.config();

const RECOMMEND_TABLE = process.env.RECOMMEND_TABLE;
const REGION = process.env.REGION;

const client = new DynamoDBClient({ region: REGION });

export const getRecommend = async (_p) => {
  const email = _p.email;
  const params = {
    TableName: RECOMMEND_TABLE,
    Key: {
      userId: { S: email },
    },
  };
  const command = new GetItemCommand(params);
  const data = await client.send(command);

  const preferences = Object.keys(data.Item)
    .filter((key) => key !== 'userId')
    .map((key) => {
      return {
        type: key,
        count: data.Item[key].N,
      };
    });
  return preferences;
};
