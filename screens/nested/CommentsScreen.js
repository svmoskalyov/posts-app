import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import app from "../../firebase/config";
import { updatePostById } from "../../redux/post/postSlice";
import { selectorUserId, selectorName } from "../../redux/auth/authSelectors";

export default function CommentsScreen() {
  const dispatch = useDispatch();
  const route = useRoute();
  const { postId } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const userId = useSelector(selectorUserId);
  const name = useSelector(selectorName);
  const { photo } = useSelector((state) =>
    state.post.find((item) => item.id === postId)
  );

  const handleInputFocus = (input) => {
    setFocusedInput(input);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const createComment = async () => {
    if (comment.trim().length > 0) {
      const db = getFirestore(app);
      await addDoc(collection(db, "posts", postId, "comments"), {
        comment,
        name,
        timestamp: Date.now(),
        userId,
      });
      getAllComments();
      setComment("");
    }
  };

  const getAllComments = async () => {
    try {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(
        query(collection(db, "posts", postId, "comments"))
      );
      const result = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const sortedData = result?.sort((a, b) => b.timestamp - a.timestamp);
      setAllComments(sortedData);
      dispatch(updatePostById({ id: postId, count: result.length }));

      const innerAvatars = { ...avatars };
      await Promise.all(
        result.map(async (item) => {
          if (!innerAvatars[item.userId]) {
            innerAvatars[item.userId] = await getAvatar(item);
          }
        })
      );

      setAvatars(innerAvatars);
    } catch (error) {
      console.log(error);
    }
  };

  const getImageWithoutAvatar = ({ name }) =>
    "https://www.gravatar.com/avatar/EMAIL_MD5?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/" +
    encodeURI(name);

  const getAvatar = async ({ userId, name }) => {
    const storage = getStorage();
    try {
      const processedPhoto = await getDownloadURL(
        ref(storage, `avatarImage/${userId}`)
      );

      return processedPhoto;
    } catch (error) {
      console.log(error);
      return getImageWithoutAvatar({ name });
    }
  };

  useEffect(() => {
    getAllComments();
  }, [route.params]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.postImage} />

        <SafeAreaView style={styles.containerComments}>
          <FlatList
            data={allComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  ...styles.boxComment,
                  flexDirection: item.userId !== userId ? "row" : "row-reverse",
                }}
              >
                <Image
                  source={{
                    uri: item.userId ? avatars[item.userId] : firstTwoChars,
                  }}
                  style={{
                    ...styles.photoComment,
                    marginEnd: item.userId !== userId ? 16 : 0,
                    marginStart: item.userId !== userId ? 0 : 16,
                  }}
                />
                <View style={styles.boxText}>
                  <Text style={styles.textComment}>{item.comment}</Text>
                  <Text
                    style={{
                      ...styles.dataText,
                      textAlign: item.userId !== userId ? "right" : "left",
                    }}
                  >
                    {format(
                      new Date(item.timestamp ?? 0),
                      "dd LLLL, yyyy | HH:mm",
                      { locale: uk }
                    )}
                  </Text>
                </View>
              </View>
            )}
          />
        </SafeAreaView>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              borderRadius: 25,
              paddingBottom: focusedInput
                ? Platform.OS === "ios"
                  ? 106
                  : 16
                : 16,
            }}
          >
            <TextInput
              style={[
                { ...styles.input },
                focusedInput === "comment" && styles.focusedFormInput,
              ]}
              textAlign="left"
              placeholder="Коментувати..."
              placeholderTextColor="#BDBDBD"
              onFocus={() => handleInputFocus("comment")}
              onBlur={handleInputBlur}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.addBtn} onPress={createComment}>
              <Ionicons
                name="arrow-up-circle-sharp"
                size={44}
                color="#FF6C00"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    backgroundColor: "#FFFFFF",
  },
  containerComments: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "white",
  },
  postImage: {
    width: "100%",
    aspectRatio: 343 / 240,
    marginBottom: 32,
    borderRadius: 8,
  },
  boxComment: {
    marginBottom: 24,
  },
  textComment: {
    marginBottom: 8,
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
  },
  photoComment: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  boxText: {
    flex: 0.95,
    padding: 16,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  dataText: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    lineHeight: 12,
    color: "#BDBDBD",
  },
  input: {
    height: 50,
    padding: 14,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#E8E8E8",
    color: "#212121",
  },
  focusedFormInput: {
    borderColor: "#FF6C00",
    backgroundColor: "#FFFFFF",
  },
  addBtn: {
    position: "absolute",
    top: 2,
    right: 3,
  },
});
