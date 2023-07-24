import { TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { authSingOutUser } from "../redux/auth/authOperations";
import PostsScreen from "../screens/main/PostsScreen";
import CreatePostsScreen from "../screens/main/CreatePostsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

const MainTab = createBottomTabNavigator();

export default function TabNavigation() {
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(authSingOutUser());
  };

  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        sceneContainerStyle: {
          flex: 1,
        },
        tabBarStyle: {
          height: 83,
          paddingBottom: 34,
          paddingTop: 9,
          paddingHorizontal: "15%",
        },
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
    >
      <MainTab.Screen
        name="Публікації"
        component={PostsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="grid" size={24} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={signOut}
              style={{ marginHorizontal: 16 }}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
      <MainTab.Screen
        name="Створити публікацію"
        component={CreatePostsScreen}
        options={({ navigation }) => {
          return {
            tabBarStyle: { display: "none" },
            tabBarIcon: () => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 70,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FF6C00",
                }}
              >
                <Feather name="plus" size={24} color={"#FFFFFF"} />
              </View>
            ),
            headerStyle: {
              borderBottomWidth: 0.5,
              borderBottomColor: "rgba(0, 0, 0, 0.30)",
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Roboto-Medium",
              fontSize: 17,
              lineHeight: 22,
              color: "#212121",
            },
            headerLeft: () => (
              <Feather
                name="arrow-left"
                color="#212121CC"
                size={24}
                style={{ marginLeft: 16 }}
                onPress={() => {
                  navigation.navigate("Публікації");
                }}
              />
            ),
          };
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}
