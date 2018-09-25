const crypto = require('crypto');
const got = require('got');

const OPENAPI_HOST = 'cdn.api.qcloud.com';
const OPENAPI_PATH = '/v2/index.php';
const OPENAPI_URL = `https://${OPENAPI_HOST}${OPENAPI_PATH}`;
const METHOD = 'POST';

/**
 * 哈希计算
 * @param {string} algorithm 算法
 * @param {string} key 密钥
 * @param {string} data 数据
 */
function hmac(algorithm, key, data) {
  return crypto
    .createHmac(algorithm, key)
    .update(data, 'utf8')
    .digest('base64');
}

/**
 * @typedef {object} SignatureData - 签名需要的数据
 * @prop {string} actionName - 方法名
 * @prop {string|number} nonce - 随机值
 * @prop {number} timestamp - 时间戳
 * @prop {object} params - 其他参数
 */

/**
 * @typedef {object} Secret - 密钥
 * @prop {string} secretId - SecretId
 * @prop {string} secretKey - SecretKey
 */

/**
 * 数字签名
 * @param {Secret} secret - 密钥
 * @param {SignatureData} data - 签名需要的数据
 */
function createSignature(
  { secretId, secretKey },
  { actionName, nonce, timestamp, params },
) {
  const origin = Object.assign(
    {
      Action: actionName,
      Nonce: nonce,
      SecretId: secretId,
      Timestamp: timestamp,
    },
    params,
  );

  const serialize = Object.keys(origin)
    .sort()
    .map(key => `${key}=${origin[key]}`)
    .join('&');

  const signature = `${METHOD}${OPENAPI_HOST}${OPENAPI_PATH}?${serialize}`;

  return hmac('sha1', secretKey, signature);
}

/**
 * 请求方法
 * @param {string} actionName - 方法名
 * @param {object} params - 其他参数
 * @param {Secret} secret - 密钥
 */
function fetch(actionName, params, secret) {
  const timestamp = Math.ceil(Date.now() / 1000);
  const nonce = timestamp.toString(36);
  const signature = createSignature(secret, {
    actionName,
    nonce,
    timestamp,
    params,
  });

  const body = Object.assign(
    {
      Action: actionName,
      Timestamp: timestamp,
      Nonce: nonce,
      SecretId: secret.secretId,
      Signature: signature,
    },
    params,
  );

  return got
    .post(OPENAPI_URL, { body, form: true, json: true })
    .then(({ body }) => body);
}

/**
 * @typedef {object} ReplyData - 返回结果
 * @prop {number} code - 错误码
 * @prop {string} message - 模块错误信息描述
 * @prop {string} codeDesc - 英文错误信息
 * @prop {object} data - 相关数据
 */

/**
 * SDK 初始化方法
 * @param {Secret} secret - 密钥
 * @returns {(actionName: string, params?: object) => Promise<ReplyData>}
 */
function qcloudSDK(secret) {
  return (actionName, params) => fetch(actionName, params, secret);
}

module.exports = qcloudSDK;

// 例子:
// const qcloud = qcloudSDK({
//   secretId: 'AKIDPg2DEPkP7f1BD3n2oRsU0GLEuSvFaIJC',
//   secretKey: 'pW0ICuTuQo15yf9WhgUIMhrtkPsGXgKI',
// });

// qcloud('DescribeCdnHosts')
//   .then(res => console.log(res))
//   .catch(err => console.log(err));

// qcloud('RefreshCdnUrl', {
//   'urls.0': 'http://img.juxiangyou.com/assets/20180823/js/common.min.js',
//   'urls.1': 'http://img.juxiangyou.com/assets/20180823/css/common/common.min.css',
// })
//   .then(res => console.log(res))
//   .catch(err => console.log(err));

// qcloud('GetCdnRefreshLog', {
//   startDate: '2018-09-25 00:00:00',
//   endDate: '2018-09-25 17:40:54',
//   host: 'img.juxiangyou.com',
// })
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
