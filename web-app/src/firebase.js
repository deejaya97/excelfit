import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const firebaseConfig = {
  apiKey: 'AIzaSyDaennHoD5FFwaBX6uNqZnpKn5Y3Jw-_y0',
  authDomain: 'excelfit-c87bf.firebaseapp.com',
  projectId: 'excelfit-c87bf',
  storageBucket: 'excelfit-c87bf.firebasestorage.app',
  messagingSenderId: '559994995377',
  appId: '1:559994995377:web:eeeda811dd7ddcddad9890',
  measurementId: 'G-4CJ9TVHK04',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const dataConnect = getDataConnect(app, connectorConfig);

isSupported()
  .then((supported) => {
    if (supported) getAnalytics(app);
  })
  .catch(() => {});
