import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { selectorUserId } from "../redux/auth/authSelectors";

export default function PhotoAvatar({ photo, updatePhoto }) {
  const userId = useSelector(selectorUserId);
  const [hasPermission, setHasPermission] = useState(null);

  const getAvatar = async () => {
    if (!userId) {
      return;
    }
    const storage = getStorage();
    try {
      const avatarUrl = await getDownloadURL(
        ref(storage, `avatarImage/${userId}`)
      );
      updatePhoto(avatarUrl);
      return;
    } catch (error) {
      if (photo) {
        await uploadPhotoToServer(photo);
      }
      return;
    }
  };

  const pickImage = async () => {
    if (!hasPermission) {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        return Alert.alert("У доступі до медіатеки відмовлено");
      }
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const compressedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 200, height: 200 } }],
          {
            compress: 0.5,
          }
        );

        if (!userId) {
          return updatePhoto(compressedImage.uri);
        }

        const avatarUrl = await uploadPhotoToServer(compressedImage.uri);
        updatePhoto(avatarUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhotoToServer = async (img) => {
    try {
      const response = await fetch(img);
      const file = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `avatarImage/${userId}`);
      await uploadBytes(storageRef, file);
      const processedPhoto = await getDownloadURL(
        ref(storage, `avatarImage/${userId}`)
      );

      return processedPhoto;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.photoWrapper}>
        <View style={styles.photoBox}>
          {photo && <Image style={styles.photo} source={{ uri: photo }} />}
        </View>
      </View>
      <TouchableOpacity
        style={!photo ? styles.loadPhoto : styles.donePhoto}
        onPress={pickImage}
      >
        <AntDesign
          name="pluscircleo"
          size={25}
          color={!photo ? "#FF6C00" : "#BDBDBD"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  photoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    overflow: "hidden",
  },
  photoBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  textLink: {
    textAlign: "center",
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  loadPhoto: {
    position: "absolute",
    right: -12,
    bottom: 14,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
  },
  donePhoto: {
    position: "absolute",
    right: -12,
    bottom: 14,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },
});
