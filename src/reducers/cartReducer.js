export const cartInitial={items:[]};
const keyOf=item=>item.cartKey||`${item.id}:${item.projectId||'store'}`;
export function cartReducer(s,a){
  switch(a.type){
    case 'ADD_TO_CART':{const projectId=a.projectId||null,cartKey=`${a.payload.id}:${projectId||'store'}`,f=s.items.find(i=>keyOf(i)===cartKey),qty=Math.max(1,Number(a.quantity)||1),item={...a.payload,projectId,projectName:a.projectName||null,cartKey};
      return {items:f?s.items.map(i=>keyOf(i)===cartKey?{...i,qty:i.qty+qty}:i):[...s.items,{...item,qty}]}}
    case 'REMOVE_FROM_CART':return {items:s.items.filter(i=>keyOf(i)!==a.payload&&i.id!==a.payload)};
    case 'INCREASE_QUANTITY':return {items:s.items.map(i=>keyOf(i)===a.payload||i.id===a.payload?{...i,qty:i.qty+1}:i)};
    case 'DECREASE_QUANTITY':return {items:s.items.map(i=>keyOf(i)===a.payload||i.id===a.payload?{...i,qty:i.qty-1}:i).filter(i=>i.qty>0)};
    case 'CLEAR_CART':return cartInitial;
    default:return s;
  }
}
