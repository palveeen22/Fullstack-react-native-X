// components/Post.jsx
import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useMutation } from "@apollo/client";
import Ionicons from "react-native-vector-icons/Ionicons";
import timeAgo from "../utils/timeAgo";
import { LIKE_POST } from "../queries";

const Post = ({
  content,
  tags,
  imgUrl,
  likes,
  comments,
  createdAt,
  _id,
  userId,
  navigation,
}) => {
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(likes.includes(userId));

  const [likePost] = useMutation(LIKE_POST, {
    variables: { id: _id },
    onCompleted: () => {
      if (!isLiked) {
        setLikeCount(likeCount + 1);
        setIsLiked(true);
      }
    },
    onError: (error) => {
      console.error("Error liking post:", error);
    },
  });

  const handleLike = () => {
    if (!isLiked) {
      likePost();
    } else {
      alert("You've already liked this post.");
    }
  };

  return (
    <View style={styles.postContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("UserProfile", { userId: _id })}
      >
        <View style={styles.postHeader}>
          <Ionicons name={"person"} size={24} color={"#ffffff"} />
          <Text style={styles.username}>{_id}</Text>
        </View>
      </TouchableOpacity>

      <Image source={{ uri: imgUrl }} style={styles.postImage} />

      <View style={styles.interactionContainer}>
        <TouchableOpacity style={styles.interactionButton} onPress={handleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={"#ffffff"}
          />
          <Text style={styles.interactionText}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.interactionButton}
          onPress={() => navigation.navigate("PostDetails", { postId: _id })}
        >
          <Ionicons name={"chatbubble-outline"} size={24} color={"#ffffff"} />
          <Text style={styles.interactionText}>{comments.length}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{content}</Text>
      <Text style={styles.tags}>{tags.join(", ")}</Text>
      <Text style={styles.postDate}>{timeAgo(createdAt)}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("PostDetails", { postId: _id })}
      >
        <Text style={styles.viewComments}>View Comments</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#181818",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Avenir-Medium",
    marginLeft: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionText: {
    color: "#fff",
    marginLeft: 8,
  },
  postContent: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Avenir-Medium",
    marginBottom: 4,
  },
  tags: {
    color: "#4c8bf5",
    fontSize: 12,
    fontFamily: "Avenir-Medium",
    marginBottom: 4,
  },
  postDate: {
    color: "#aaa",
    fontSize: 12,
    fontFamily: "Avenir-Medium",
    marginBottom: 4,
  },
  viewComments: {
    color: "#4c8bf5",
    fontSize: 14,
    fontFamily: "Avenir-Medium",
    marginTop: 4,
  },
});

export default Post;
