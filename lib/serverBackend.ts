export const getApiPrefix = () => {
  const base = process.env.API_PREFIX;
  if (!base) {
    throw new Error('缺少环境变量 API_PREFIX');
  }
  return base;
};

export const backendURL = (path: string) => new URL(path, getApiPrefix());

export const backendUrl = (path: string) => backendURL(path).toString();
