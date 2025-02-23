interface StoreType {
  [key: string]: any; // adjust this to match the actual structure of your objects
}

let STORE: StoreType = {};
// TODO:
// 1) create set/get
// 2) compare values with+ initials
if (
  typeof window !== 'undefined' &&
  (location.hostname === 'localhost' || location.search.includes('__justorm__'))
) {
  let f = '__justorm__';
  // @ts-ignore
  if (!window[f]) window[f] = {};
  // @ts-ignore
  STORE = window[f];
}

export default STORE;
