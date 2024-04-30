// components/CommentForm.jsx
import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const CommentForm = ({ onCommentSubmit }) => {
  const [comment, setComment] = useState("");

  const submitComment = () => {
    const trimmedComment = comment.trim();
    if (trimmedComment) {
      onCommentSubmit(trimmedComment);
      setComment("");
    } else {
      Alert.alert("Error", "The comment cannot be empty.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color="#4c8bf5"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#aaa"
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={submitComment}>
        <Text style={styles.buttonText}>Post Comment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 5,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
    paddingRight: 10,
  },
  button: {
    backgroundColor: "#4c8bf5",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default CommentForm;
