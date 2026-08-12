import serverless from 'serverless-http';
import app from '../../server.js';

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  try {
    const response = await serverlessHandler(event, context);
    return response;
  } catch (err) {
    console.error('[Netlify Function Handler Exception]:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: `Serverless Function Error: ${err.message || 'Internal Error'}`
      })
    };
  }
};
