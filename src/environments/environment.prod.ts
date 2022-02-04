export const environment = {
  production: true,
  apiUrl: window["env"]["apiUrl"] || "https://jokul.doku.com/retail-api/v1",
  envUrl: window["env"]["envUrl"] || "https://jokul.doku.com",
  gtmId: window["env"]["gtmId"] || "GTM-THMNVMK",
  assetsUrl: window["env"]["assetsUrl"] || "https://cdn-doku.oss-ap-southeast-5.aliyuncs.com"
};
