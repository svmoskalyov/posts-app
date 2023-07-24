import { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  getCountFromServer,
} from "firebase/firestore";
import app from "../../firebase/config";
import { updatePosts } from "../../redux/post/postSlice";
import { selectorPost } from "../../redux/post/postSelectors";
import PostCard from "../../components/PostCard";

export default function PostsScreen() {
  const dispatch = useDispatch();
  const route = useRoute();
  const posts = useSelector(selectorPost);

  const getAllPost = async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(
      query(collection(db, "posts"), orderBy("timestamp", "desc"))
    );

    const result = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const snap = await getCountFromServer(
          collection(db, "posts", doc.id, "comments")
        );
        return { ...doc.data(), id: doc.id, count: snap.data().count };
      })
    );
    dispatch(updatePosts(result));
  };

  useEffect(() => {
    getAllPost();
  }, [route]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
});
