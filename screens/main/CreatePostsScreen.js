import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import app from "../../firebase/config";
import { selectorUserId, selectorName } from "../../redux/auth/authSelectors";

const initialState = {
  namePost: "",
  location: "",
  coords: {},
  photo: null,
};

export default function CreatePostsScreen() {
  const navigation = useNavigation();
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [camera, setCamera] = useState(null);
  const [location, setLocation] = useState(null);
  const userId = useSelector(selectorUserId);
  const name = useSelector(selectorName);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    try {
      const photo = await camera.takePictureAsync();
      const [position] = await Location.reverseGeocodeAsync(location);

      setState((prevState) => ({
        ...prevState,
        photo: photo.uri,
        location: `${position.city}, ${position.region}`,
        coords: {
          ...location,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const sendPost = async () => {
    try {
      await uploadPostToServer();
      navigation.navigate("Публікації", { newPost: Date.now().toString() });
      setState(initialState);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(state.photo);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
      const storage = getStorage();
      const storageRef = ref(storage, `postImage/${uniquePostId}`);
      await uploadBytes(storageRef, file);
      const processedPhoto = await getDownloadURL(
        ref(storage, `postImage/${uniquePostId}`)
      );

      return processedPhoto;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();

    try {
      const db = getFirestore(app);
      const obj = {
        ...state,
        photo,
        userId,
        name,
        timestamp: Date.now(),
      };

      await addDoc(collection(db, "posts"), obj);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("У доступі до камери відмовлено");
      }
    })();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("У доступі до місцезнаходження відмовлено");
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
    })();
  }, []);

  const deletePost = () => {
    setState(initialState);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View style={styles.cameraWrapper}>
            <Camera style={styles.camera} ref={setCamera}>
              <View style={styles.takePhotoCamera}>
                <Image source={{ uri: state.photo }} style={styles.photo} />
              </View>
              <TouchableOpacity
                style={styles.buttonCamera}
                onPress={() => {
                  takePhoto();
                }}
              >
                <MaterialIcons name="photo-camera" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </Camera>
          </View>
          <Text style={styles.uploadText}>
            {!state.photo ? "Завантажити фото" : "Редагувати фото"}
          </Text>
          <View style={styles.inpuWrapper}>
            <TextInput
              style={{
                ...styles.inputTitle,
                paddingTop: isShowKeyboard
                  ? Platform.OS === "ios"
                    ? 18
                    : 16
                  : 32,
              }}
              placeholder="Назва..."
              placeholderTextColor="#BDBDBD"
              onFocus={() => setIsShowKeyboard(true)}
              value={state.namePost}
              onChangeText={(value) =>
                setState((prevState) => ({ ...prevState, namePost: value }))
              }
            />
          </View>
          <View style={styles.inpuWrapper}>
            <View style={{ position: "absolute", bottom: 16 }}>
              <AntDesign name="enviromento" size={24} color="#BDBDBD" />
            </View>
            <TextInput
              style={{
                ...styles.inputTitle,
                marginLeft: 32,
                paddingTop: isShowKeyboard
                  ? Platform.OS === "ios"
                    ? 18
                    : 16
                  : 32,
              }}
              placeholder="Місцевість..."
              placeholderTextColor="#BDBDBD"
              onFocus={() => setIsShowKeyboard(true)}
              value={state.location}
              onChangeText={(value) =>
                setState((prevState) => ({
                  ...prevState,
                  location: value,
                }))
              }
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                ...styles.btnPublish,
                backgroundColor:
                  !state.photo || !state.namePost || !state.location
                    ? "#F6F6F6"
                    : "#FF6C00",
                marginTop: isShowKeyboard
                  ? Platform.OS === "ios"
                    ? 60
                    : 60
                  : 32,
              }}
              activeOpacity={0.7}
              disabled={
                !state.photo || !state.namePost || !state.location
                  ? true
                  : false
              }
              onPress={sendPost}
            >
              <Text
                style={{
                  ...styles.textBtn,
                  color:
                    !state.photo || !state.namePost || !state.location
                      ? "#BDBDBD"
                      : "#FFFFFF",
                }}
              >
                Опублікувати
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
              paddingTop: Platform.OS === "ios" ? 128 : 104,
            }}
          >
            <TouchableOpacity style={styles.btnTrash} onPress={deletePost}>
              <AntDesign name="delete" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  cameraWrapper: {
    marginTop: 32,
    marginHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  camera: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 343 / 240,
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8",
  },
  takePhotoCamera: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  buttonCamera: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "#FFFFFF4D",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  uploadText: {
    marginTop: 8,
    paddingLeft: 16,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  inpuWrapper: {
    position: "relative",
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputTitle: {
    marginBottom: 15,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  btnPublish: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    height: 51,
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
  },
  textBtn: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  btnTrash: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
  },
});
