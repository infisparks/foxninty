// components/firebaseClient.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCt_2hlmYjIpWsxSMpXNOwmpPzwyNnIiB8",
  authDomain: "the-times-e4a65.firebaseapp.com",
  databaseURL: "https://the-times-e4a65-default-rtdb.firebaseio.com",
  projectId: "the-times-e4a65",
  storageBucket: "the-times-e4a65.appspot.com",
  messagingSenderId: "958497728175",
  appId: "1:958497728175:web:60fcdfdf97564fe083165a",
  measurementId: "G-BLT9FRR41R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Storage
const database = getDatabase(app);
const storage = getStorage(app);

export { app, database, storage };
