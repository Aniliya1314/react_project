import CryptoJS from "crypto-js";

export const SECRETKEY = "front_666666";

export function throttle(fn, delay = 100) {
  let isThrottling = false;
  return function (...args) {
    if (!isThrottling) {
      isThrottling = true;
      setTimeout(() => {
        isThrottling = false;
        fn.apply(this, args);
      }, delay);
    }
  };
}

export function debounce(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**生成指定区间的随机数*/
export function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**加密函数*/
export function encrypt(str) {
  return CryptoJS.AES.encrypt(JSON.stringify(str), SECRETKEY).toString();
}

/**解密函数*/
export function decrypt(str) {
  const bytes = CryptoJS.AES.decrypt(str, SECRETKEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
