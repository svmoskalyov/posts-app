import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function PostCard({ item }) {
  const navigation = useNavigation();

  return (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.photo }} style={styles.postImage} />
      <Text style={styles.postName}>{item.namePost}</Text>
      <View
        style={{
          height: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <TouchableOpacity
          style={{ ...styles.infoBtn }}
          onPress={() => navigation.navigate("Коментарі", { postId: item.id })}
        >
          {item.count === 0 ? (
            <>
              <View style={{ transform: "scaleX(-1)" }}>
                <FontAwesome name="comment-o" size={24} color="#BDBDBD" />
              </View>
              <Text style={{ ...styles.infoText, color: "#BDBDBD" }}>
                {item.count}
              </Text>
            </>
          ) : (
            <>
              <View style={{ transform: "scaleX(-1)" }}>
                <FontAwesome name="comment" size={24} color="#FF6C00" />
              </View>
              <Text style={styles.infoText}>{item.count}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.infoBtn }}
          onPress={() =>
            navigation.navigate("Мапа", {
              coords: item.coords,
            })
          }
        >
          <Feather name="map-pin" size={24} color="#BDBDBD" />
          <Text
            style={{
              ...styles.infoText,
              textAlign: "right",
              textDecorationLine: "underline",
            }}
          >
            {item.location}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    marginBottom: 32,
  },
  postImage: {
    width: "100%",
    aspectRatio: 343 / 240,
    marginBottom: 8,
    borderRadius: 8,
  },
  postName: {
    marginBottom: 8,
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 19,
  },
  infoBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    paddingHorizontal: 6,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
});
