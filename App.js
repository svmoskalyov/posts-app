import React from "react";
import { useCallback } from "react";
import "react-native-gesture-handler";
import { View } from "react-native";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import MainNavigation from "./navigations/MainNavigation";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <MainNavigation />
        </View>
      </PersistGate>
    </Provider>
  );
}
