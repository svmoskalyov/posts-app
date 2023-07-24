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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { authSingUpUser } from "../../redux/auth/authOperations";
import backgroundImage from "../../assets/images/background.png";
import PhotoAvatar from "../../components/PhotoAvatar";

const initialState = {
  name: "",
  email: "",
  password: "",
  photo: null,
};

export default function RegistrationScreen() {
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
    const { name, email, password } = state;
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert("Заповніть поля");
    }

    dispatch(authSingUpUser(state));
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
          keyboardVerticalOffset={Platform.OS === "ios" ? -140 : -140}
        >
          <View style={styles.form}>
            <View style={styles.photoContainer}>
              <PhotoAvatar
                photo={state.photo}
                updatePhoto={(photo) =>
                  setState((state) => ({ ...state, photo }))
                }
              />
            </View>
            <Text style={styles.title}>Реєстрація</Text>
            <TextInput
              style={[
                { ...styles.input, marginBottom: 16, width: dimensions },
                focusedInput === "login" && styles.focusedFormInput,
              ]}
              textAlign="left"
              placeholder="Логін"
              placeholderTextColor="#BDBDBD"
              onFocus={() => handleInputFocus("login")}
              onBlur={handleInputBlur}
              value={state.name}
              onChangeText={(value) =>
                setState((prevState) => ({ ...prevState, name: value }))
              }
            />
            <TextInput
              style={[
                { ...styles.input, marginBottom: 16, width: dimensions },
                focusedInput === "email" && styles.focusedFormInput,
              ]}
              textAlign="left"
              placeholder="Адреса електронної пошти"
              placeholderTextColor="#BDBDBD"
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
              <Text style={styles.btnText}>Зареєстуватися</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.8}
            >
              <Text style={styles.textLink}>Вже є акаунт? Увійти</Text>
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
    paddingBottom: 45,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  input: {
    padding: 14,
    height: 50,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
  },
  focusedFormInput: {
    borderColor: "#FF6C00",
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginBottom: 33,
    textAlign: "center",
    color: "#212121",
    fontFamily: "Roboto-Medium",
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
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
  },
  photoContainer: {
    alignItems: "center",
    width: "50%",
    height: 120,
    marginTop: -60,
    marginBottom: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  textLink: {
    textAlign: "center",
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
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
