import {useReducer,useEffect} from 'react';
export default function usePersistedReducer(reducer,key,initial){
  const [state,dispatch]=useReducer(reducer,initial,i=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):i}catch{return i}});
  useEffect(()=>{localStorage.setItem(key,JSON.stringify(state))},[state,key]);
  return [state,dispatch];
}
