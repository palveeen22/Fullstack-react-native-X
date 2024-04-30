// screens/RegisterPage.jsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../queries";

const RegisterPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      if (data.register.statusCode === 200) {
        navigation.navigate("Login");
      } else {
        setErrorMessage(data.register.message);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleRegister = () => {
    const emailFormat = /\S+@\S+\.\S+/;
    if (!username || !email || !password) {
      setErrorMessage("Username, email, and password are required");
      return;
    }
    if (!emailFormat.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }
    if (password.length < 5) {
      setErrorMessage("Password must be at least 5 characters long");
      return;
    }

    registerUser({
      variables: {
        input: {
          username,
          email,
          password,
        },
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text
              style={styles.buttonText}
              onPress={() => navigation.navigate("Login")}
            >
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
          {!!errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default RegisterPage;
