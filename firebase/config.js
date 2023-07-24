import { initializeApp } from "firebase/app";
import {
  FB_API_KEY,
  FB_AUTH_DOMAIN,
  FB_PROJECT_ID,
  FB_STORAGE_BUCKET,
  FB_MESSAGING_SEDER_ID,
  FB_APP_ID,
} from "@env";

const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_AUTH_DOMAIN,
  projectId: FB_PROJECT_ID,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MESSAGING_SEDER_ID,
  appId: FB_APP_ID,
};

const app = initializeApp(firebaseConfig);

export default app;
