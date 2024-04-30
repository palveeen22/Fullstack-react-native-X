// screens/AddPostPage.jsx
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useMutation } from "@apollo/client";
import AddPostForm from "../components/AddPostForm";
import { ADD_POST } from "../queries";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddPostPage = () => {
  const [addPost, { loading, error }] = useMutation(ADD_POST, {
    onCompleted: () => {
      Alert.alert("Success", "Your post has been added!");
    },
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
  });

  const handleAddPost = async (postData) => {
    try {
      await addPost({
        variables: {
          input: {
            ...postData,
            comments: [],
            likes: [],
          },
        },
      });
      console.log("Post added successfully");
    } catch (error) {
      console.error("Error adding post", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Ionicons name="create" size={64} color="#fff" style={styles.icon} />
          <AddPostForm onAddPost={handleAddPost} />
          {loading && <ActivityIndicator size="large" color="#ffffff" />}
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
  },
  icon: {
    alignSelf: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default AddPostPage;
