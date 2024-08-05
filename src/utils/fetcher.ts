const SDK_VERSION = process.env.SDK_VERSION || '0.0.0';

const customFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  options.headers = {
    ...options.headers,
    'x-frontend-sdk-version': SDK_VERSION,
  };

  return fetch(url, options);
};

export default customFetch;