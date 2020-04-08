import React, { useState, useEffect, useReducer } from 'react'
import io from './io'
import { Spin } from 'antd'

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.data,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const useDataApi = (initialData, initialParam) => {
  const [param, setParam] = useState(initialParam);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await io.getHomeData(param);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', data: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
    fetchData();

    return () => {
      didCancel = true;
    };
  }, [param]);

  return [state, setParam];
};

const Home = () => {
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    [],
    {
      name: undefined,
      type: undefined,
    },
  );

  return <>
    <div>这是Home</div>

    <div 
      onClick={() => doFetch({
        name: '123'
      })}
    >点击获取数据</div>

    <Spin spinning={isLoading} />

    {isError && <div>出错了</div>}
  </>
}

export default Home
