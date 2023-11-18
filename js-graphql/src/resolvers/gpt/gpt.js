import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const endpoint = process.env.OPENAI_ENDPOINT;
const apiKey = process.env.OPENAI_API_KEY;

export const getChatResponse = async (_p, { userInput }) => {
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
  const message = [{ role: 'user', content: userInput }];

  const deploymentId = 'gpt4';

  try {
    const response = await client.getChatCompletions(deploymentId, message);
    for (const c of response.choices) {
      return c.message.content;
    }
    return;
  } catch (error) {
    console.error(error);
    return 'Sorry, I have error';
  }
};
