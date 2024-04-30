//components/AddPostForm.jsx
import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddPostForm = ({ onAddPost }) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const submitPost = () => {
    if (!content) {
      Alert.alert("Error", "Please enter some content for the post.");
      return;
    }

    onAddPost({ content, tags: tags.split(","), imgUrl });
    setContent("");
    setTags("");
    setImgUrl("");
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Ionicons name="pencil" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#aaa"
          multiline
          value={content}
          onChangeText={setContent}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="pricetags" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          placeholderTextColor="#aaa"
          value={tags}
          onChangeText={setTags}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="image" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          placeholderTextColor="#aaa"
          value={imgUrl}
          onChangeText={setImgUrl}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={submitPost}>
        <Text style={styles.buttonText}>Add Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 5,
    animation: "fadeIn 0.2s ease-in",
  },
  icon: {
    padding: 1,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
    paddingRight: 10,
  },
  button: {
    backgroundColor: "#000",
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

export default AddPostForm;
