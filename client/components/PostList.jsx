// components/PostList.jsx
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import timeAgo from "../utils/timeAgo";

const PostList = ({ posts, navigation }) => {
  if (!posts) {
    return (
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        No posts yet. [Because not yet implemented]
      </Text>
    );
  }

  return (
    <View>
      {posts.map((post, index) => (
        <View key={index} style={styles.postContainer}>
          <Image source={{ uri: post.imgUrl }} style={styles.postImage} />
          <Text style={styles.postContent}>{post.content}</Text>
          <Text style={styles.postDate}>Posted {timeAgo(post.createdAt)}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PostDetails", { postId: post._id })
            }
          >
            <Text style={styles.viewComments}>View Comments</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#181818",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postContent: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  postDate: {
    color: "#808080",
    fontSize: 14,
    marginBottom: 10,
  },
  viewComments: {
    color: "#4c8bf5",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PostList;
