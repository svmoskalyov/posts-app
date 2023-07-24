import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./auth/authSlice";
import postReducer from "./post/postSlice";

const authPersistConfigs = {
  key: "auth",
  storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer(authPersistConfigs, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
