import serverless from 'serverless-http';
import * as serverModule from '../../server.js';

// Netlify's bundler can wrap ESM default exports differently from the local
// Node runtime. Resolve either export shape before passing the Express app to
// serverless-http; otherwise the function fails during cold start with
// "Unsupported framework" and every admin API request is unavailable.
const app = [
  serverModule.default,
  serverModule.app,
  serverModule.default?.default,
  serverModule.default?.app
].find((candidate) => typeof candidate === 'function');

if (!app) {
  throw new Error('Express application export could not be resolved.');
}

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
