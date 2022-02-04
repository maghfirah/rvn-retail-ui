export const environment = {
  production: false,
  apiUrl: window["env"]["apiUrl"]  || "http://localhost:8080/retail-api/v1",
  envUrl: window["env"]["envUrl"]  || "https://app-uat.doku.com",
  gtmId: window["env"]["gtmId"] || "",
  assetsUrl: window["env"]["assetsUrl"] || "https://cdn-dev.oss-ap-southeast-5.aliyuncs.com"
};
