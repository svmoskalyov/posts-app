import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { authSingInUser } from "../../redux/auth/authOperations";
import backgroundImage from "../../assets/images/background.png";
import { Alert } from "react-native";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [state, setState] = useState(initialState);
  const { height, width } = useWindowDimensions();
  const [dimensions, setDimensions] = useState(width - 16 * 2);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isHidePassword, setIsHidePassword] = useState(true);

  const handleInputFocus = (input) => {
    setFocusedInput(input);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const handleHidePassword = () => {
    setIsHidePassword(!isHidePassword);
  };

  const handleSubmit = () => {
    const { email, password } = state;
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Заповніть поля");
    }

    dispatch(authSingInUser(state));
    setState(initialState);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ position: "absolute", width: width, height: height }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -210 : -210}
        >
          <View style={styles.form}>
            <Text style={styles.title}>Увійти</Text>
            <TextInput
              style={[
                { ...styles.input, marginBottom: 16, width: dimensions },
                focusedInput === "email" && styles.focusedFormInput,
              ]}
              textAlign={"left"}
              placeholder={"Адреса електронної пошти"}
              placeholderTextColor={"#BDBDBD"}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => handleInputFocus("email")}
              onBlur={handleInputBlur}
              value={state.email}
              onChangeText={(value) =>
                setState((prevState) => ({ ...prevState, email: value }))
              }
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  { ...styles.input, marginBottom: 43, width: dimensions },
                  focusedInput === "password" && styles.focusedFormInput,
                ]}
                textAlign="left"
                placeholder="Пароль"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={isHidePassword}
                onFocus={() => handleInputFocus("password")}
                onBlur={handleInputBlur}
                value={state.password}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, password: value }))
                }
              />
              <TouchableOpacity
                style={styles.passwordButton}
                onPress={handleHidePassword}
              >
                <Text style={styles.passwordButtonText}>
                  {isHidePassword ? "Показати" : "Приховати"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ ...styles.btn, width: dimensions }}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>Увійти</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.8}
            >
              <Text style={styles.textLogin}>
                Немає акаунту?{" "}
                <Text style={styles.registrationText}>Зареєструватися</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 111,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  input: {
    height: 50,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    color: "#212121",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  focusedFormInput: {
    borderColor: "#FF6C00",
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginBottom: 33,
    textAlign: "center",
    color: "#212121",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
  },
  btn: {
    marginBottom: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    textAlign: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
  },
  textLogin: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1B4371",
  },
  registrationText: {
    textDecorationLine: "underline",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  passwordButtonText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1B4371",
  },
});
