import * as nattyFetch from 'natty-fetch'
// import React from 'react'
import { api } from './config'

const context = nattyFetch.context({
  // urlPrefix: `${api}/`,
  urlPrefix: `/`,
  method: 'POST',
  rest: true,
  header: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  // 目前还没有做鉴权, 下面的设置为 false, 和服务端的*相对应
  // 如果设为 true, 需要服务端设置响应头 Access-Control-Allow-Origin 为具体的白名单
  withCredentials: false,
  mockUrlPrefix: '/mock/',
  // 添加额外参数后端会报错, 如: _api, 略坑
  urlMark: false, 
  // 添加额外参数后端会报错, 如: _stamp, 略坑
  urlStamp: false, 
  fit(response) {
    if (response) {
      return {
        success: response.success,
        content: response.content,
        error: {
          message: response.message || response.errorMsg,
          code: response.code || response.errorCode,
        },
      }
    }
    return {
      success: false,
      content: null,
      error: {
        message: '网络异常，请刷新页面重试！',
        code: '',
      },
    }
  },
})

export default context
