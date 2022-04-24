/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  development: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/0984aff28b74c54752ccf5df8b6811ac/api",
  },
  test: {
    baseApi: "//test.fitirefe.cpm/api",
    mockApi:
      "https://www.fastmock.site/mock/bba13eafb6304b95282a54db0b268345/api",
  },
  prod: {
    baseApi: "//futurefe.com/api",
    mockApi:
      "https://www.fastmock.site/mock/bba13eafb6304b95282a54db0b268345/api",
  },
}
export default {
  env: "dev",
  mock: true,
  //@ts-ignore
  ...EnvConfig[env],
  namespace: "futurefe",
};
