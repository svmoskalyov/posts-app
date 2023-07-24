import { createStackNavigator } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import TabNavigation from "../../navigations/TabNavigation";
import CommentsScreen from "./CommentsScreen";
import MapScreen from "./MapScreen";

const NestedScreen = createStackNavigator();

export default function Home() {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Home"
        component={TabNavigation}
        options={{
          headerShown: false,
          headerStyle: {
            height: 88,
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Roboto-Medium",
            fontSize: 17,
            lineHeight: 22,
          },
        }}
      />
      <NestedScreen.Screen
        name="Коментарі"
        component={CommentsScreen}
        options={({ navigation }) => {
          return {
            headerStyle: {
              height: 88,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Roboto-Medium",
              fontSize: 17,
              lineHeight: 22,
            },
            headerLeft: () => (
              <Feather
                name="arrow-left"
                color="#212121CC"
                size={24}
                style={{ marginLeft: 16 }}
                onPress={() => {
                  navigation.navigate("Home");
                }}
              />
            ),
          };
        }}
      />
      <NestedScreen.Screen
        name="Мапа"
        component={MapScreen}
        options={({ navigation }) => {
          return {
            headerStyle: {
              height: 88,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Roboto-Medium",
              fontSize: 17,
              lineHeight: 22,
            },
            headerLeft: () => (
              <Feather
                name="arrow-left"
                color="#212121CC"
                size={24}
                style={{ marginLeft: 16 }}
                onPress={() => {
                  navigation.navigate("Home");
                }}
              />
            ),
          };
        }}
      />
    </NestedScreen.Navigator>
  );
}
