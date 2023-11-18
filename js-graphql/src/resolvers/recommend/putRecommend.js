import * as dotenv from 'dotenv';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

dotenv.config();

const RECOMMEND_TABLE = process.env.RECOMMEND_TABLE;
const REGION = process.env.REGION;

const client = new DynamoDBClient({ region: REGION });

export const putRecommend = async (_p, { email, type }) => {
  const getItemParams = {
    TableName: RECOMMEND_TABLE,
    Key: {
      userId: { S: email },
    },
  };
  const getItemCommand = new GetItemCommand(getItemParams);
  const currentItem = await client.send(getItemCommand);

  const currentCount = currentItem.Item[type] ? currentItem.Item[type].N : 0;
  const newCount = parseInt(currentCount) + 1;

  const updateItemParams = {
    TableName: RECOMMEND_TABLE,
    Key: {
      userId: { S: email },
    },
    UpdateExpression: `SET #type = :newCount`,
    ExpressionAttributeNames: {
      '#type': type,
    },
    ExpressionAttributeValues: {
      ':newCount': { N: newCount.toString() },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  const updateItemCommand = new UpdateItemCommand(updateItemParams);
  const result = await client.send(updateItemCommand);
  console.log(result);
  return {
    type: type,
    count: result.Attributes[type].N,
  };
};
