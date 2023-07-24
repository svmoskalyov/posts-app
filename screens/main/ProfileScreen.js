import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  ImageBackground,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import app from "../../firebase/config";
import {
  authSingOutUser,
  authUpdatePhotoUser,
} from "../../redux/auth/authOperations";
import {
  selectorUserId,
  selectorName,
  selectorPhoto,
} from "../../redux/auth/authSelectors";
import { selectorPost } from "../../redux/post/postSelectors";
import backgroundImage from "../../assets/images/background.png";
import PhotoAvatar from "../../components/PhotoAvatar";
import PostCard from "../../components/PostCard";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const userId = useSelector(selectorUserId);
  const name = useSelector(selectorName);
  const photo = useSelector(selectorPhoto);
  const [userPosts, setUserPosts] = useState([]);
  const { height, width } = useWindowDimensions();
  const posts = useSelector(selectorPost);

  const getUserPosts = async () => {
    const db = getFirestore(app);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "posts"), where("userId", "==", userId))
      );
      const result = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const snap = await getCountFromServer(
            collection(db, "posts", doc.id, "comments")
          );
          return { ...doc.data(), id: doc.id, count: snap.data().count };
        })
      );
      const sortedData = result?.sort((a, b) => b.timestamp - a.timestamp);
      setUserPosts(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, [posts]);

  const singOut = () => {
    dispatch(authSingOutUser());
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ position: "absolute", width: width, height: height }}
    >
      <View style={styles.container}>
        <View style={styles.contentBox}>
          <View style={styles.photoContainer}>
            <PhotoAvatar
              photo={photo}
              updatePhoto={(photo) => dispatch(authUpdatePhotoUser({ photo }))}
            />
          </View>

          <TouchableOpacity onPress={singOut} style={styles.logoutBtn}>
            <Feather name="log-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <Text style={styles.title}>{name}</Text>

          <View
            style={{
              height: "100%",
              paddingBottom: Platform.OS === "ios" ? 0 : 90,
            }}
          >
            <SafeAreaView
              style={{
                flex: Platform.OS === "ios" ? 0.55 : 0.68,
              }}
            >
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard item={item} />}
              />
            </SafeAreaView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentBox: {
    position: "relative",
    alignItems: "center",
    marginTop: 147,
    marginBottom: 0,
    paddingHorizontal: 16,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: "#FFFFFF",
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
  logoutBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 22,
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
});
