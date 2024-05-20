// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://zizzamia.xyz';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0x3f01ef9b47235F388Ae1D943644BA52F76d01A63';
