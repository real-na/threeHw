import Vue from 'vue';
import axios from 'axios'
import router from '@/router'
import store from '../store/index'
import { Toast, Dialog } from 'vant';
import { base64 } from '../utils/base64';
import { clearToken, getToken } from "../utils/cookie";

let flag = 0
let base = new base64();


const showLoading = () => {
  if (flag === 0) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
  }
  flag++
};

const hideLoading = () => {
  flag--
  if (flag === 0) {
    Toast.clear()
  }
};

const service = axios.create({
  baseURL: '/api',
  // baseURL: '/mock',
  timeout: 6000000000
});

service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json';
    let token = getToken()
    const isToken = (config.headers || {}).isToken === false
    if (token !== 'null' && token && !isToken) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      // if (!config.url.includes('/web/wx/getJsapiSignature')) {
      //   config.headers['Authorization'] = 'Bearer ' + getToken()
      // }
      config.headers['Authorization'] = 'Bearer ' + token
    }
    showLoading()
    if (config.data) {
      let baseData = config.data;
      // console.log(config.data);
      config.data = {
        params: base.encode(baseData)
      }
    }
    // vuex记录cancelToken
    config.cancelToken = new axios.CancelToken((cancel) => {
      store.commit('pushToken', {
        cancelToken: cancel
      })
    })
    showLoading();
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error)
  }
);

service.interceptors.response.use(
  response => {
    hideLoading()
    hideLoading();
    if (response.data.ret) { //解密
      response.data = JSON.parse(base.decode(response.data.ret))
      // console.log(response.data);
    }
    // console.log(response.data);
    const code = response.status;
    if (code < 200 || code > 300) {
      return Promise.reject('error')
    } else {
      let {code, msg} = response.data;
      if (code === 200) {
        return response.data
      } else {
        if (code === 500) {
          if (msg === '登录错误超过5次，账号被锁定') {
            Dialog.alert({
              message: msg,
            });
          } else {
            if (msg.indexOf('服务器内部错误') > -1) {
              msg = '服务器忙，请稍后重试'
            }
            Toast({
              message: msg,
              icon: 'cross'
            });
          }
        } else if (code === 401) {
          // Toast({
          //   message: '登录超时，请重新登录',
          //   icon: 'cross'
          // });
          sessionStorage.clear();
          clearToken()
          store.dispatch('SetToken')
          // setTimeout(() => {
          if (router.currentRoute.path !== '/login') {
            router.replace('/login');
          }
          // }, 20);
        } else {
          Toast({
            message: msg,
            icon: 'cross'
          });
        }
        return Promise.reject('error')
      }
    }
  },
  error => {
    let code = 0;
    Toast.clear();
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        return Promise.reject(error)
      }
      if (error.toString().indexOf('Error: Network Error') !== -1) {
        return Promise.reject(error)
      }
    }
    if (code === 401) {

    } else if (code === 403) {

    } else {
      if (error.message === '路由跳转取消请求') {
        console.log(error.message);
      } else {
        const errorMsg = error.response.data.message || '';
        Toast({
          message: errorMsg,
          icon: 'cross'
        });
      }


    }
    return Promise.reject(error)
  }
);

service.jsonp = (url, data) => {
  if (!url)
    throw new Error('url is necessary');
  const callback = 'CALLBACK' + Math.random().toString().substr(9, 18);
  const JSONP = document.createElement('script');
  JSONP.setAttribute('type', 'text/javascript');
  const headEle = document.getElementsByTagName('head')[0];
  let ret = '';
  if (data) {
    if (typeof data === 'string')
      ret = '&' + data;
    else if (typeof data === 'object') {
      for (let key in data)
        ret += '&' + key + '=' + encodeURIComponent(data[key]);
    }
    ret += '&_time=' + Date.now();
  }
  JSONP.src = `${url}?callback=${callback}${ret}`;
  JSONP.src = `${url}?callback=${callback}${ret}`;
  return new Promise((resolve) => {
    window[callback] = r => {
      resolve(r);
      headEle.removeChild(JSONP);
      delete window[callback]
    };
    headEle.appendChild(JSONP)
  })
};
export default service
