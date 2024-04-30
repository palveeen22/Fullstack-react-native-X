// screens/PostDetailsPage.jsx
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import CommentForm from "../components/CommentForm";
import { GET_POST_BY_ID, ADD_COMMENT } from "../queries";
import timeAgo from "../utils/timeAgo";
import Ionicons from "react-native-vector-icons/Ionicons";

const PostDetailsPage = ({ route }) => {
  const { postId } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_POST_BY_ID, variables: { id: postId } }],
  });

  const handleAddComment = (comment) => {
    addComment({
      variables: {
        id: postId,
        comment,
      },
    });
  };

  useEffect(() => {
    // Fades in the content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [data]);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  const post = data?.getPostById?.data;

  const reversedComments = [...post.comments].reverse();

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={[styles.postContentContainer, { opacity: fadeAnim }]}
      >
        <Text style={styles.postContent}>{post.content}</Text>
        <Text style={styles.postDate}>{timeAgo(post.createdAt)}</Text>
      </Animated.View>

      <View style={styles.divider} />

      <CommentForm onCommentSubmit={handleAddComment} />

      {reversedComments.map((comment, index) => (
        <Animated.View style={{ opacity: fadeAnim }} key={comment._id || index}>
          <View style={styles.commentContainer}>
            <Ionicons
              name="person-circle-outline"
              size={24}
              color="#657786"
              style={styles.commentIcon}
            />
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentAuthor}>
                {timeAgo(comment.createdAt)}
              </Text>
            </View>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101010",
    padding: 10,
  },
  postContentContainer: {
    paddingVertical: 10,
  },
  postContent: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  postDate: {
    color: "#aaaaaa",
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    borderBottomColor: "#303030",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentIcon: {
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentContent: {
    color: "#ffffff",
    fontSize: 16,
  },
  commentAuthor: {
    color: "#aaaaaa",
    fontSize: 12,
    marginTop: 4,
  },
});

export default PostDetailsPage;
