// screens/LoginPage.jsx
import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { LoginContext } from "../contexts/LoginContext";
import { LOGIN_USER } from "../queries";

const LoginPage = ({ navigation }) => {
  const { setIsLoggedIn, setUserId } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [dispatcher, { loading }] = useLazyQuery(LOGIN_USER, {
    fetchPolicy: "network-only",
    onCompleted: async (res) => {
      const token = res?.login?.data?.token;
      const userId = res?.login?.data?.userId;
      if (token && userId) {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("userId", userId);
        setIsLoggedIn(true);
        setUserId(userId);
        navigation.navigate("Home");
      } else {
        setLoginError("Login failed, please try again.");
      }
    },
    onError: (error) => {
      setLoginError(error.message);
    },
  });

  const onLoginPress = () => {
    setLoginError("");
    dispatcher({
      variables: {
        email,
        password,
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
          <Image source={require("../assets/x.png")} style={styles.logo} />
          <Text style={styles.headerText}>Sign in to your account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            keyboardType="default"
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            style={styles.button}
            onPress={onLoginPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Next"}
            </Text>
          </Pressable>
          {loginError ? (
            <Text style={styles.errorText}>{loginError}</Text>
          ) : null}
          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate("Register")}
            >
              Sign up
            </Text>
          </Text>
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
    fontFamily: "Avenir-Medium",
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
    fontFamily: "Avenir-Medium",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Avenir-Medium",
  },
  linkText: {
    color: "#4c8bf5",
    fontSize: 16,
    fontFamily: "Avenir-Medium",
    marginBottom: 24,
  },
  signUpText: {
    color: "#999",
    fontSize: 16,
    fontFamily: "Avenir-Medium",
  },
  signUpLink: {
    color: "#4c8bf5",
    fontWeight: "bold",
    fontFamily: "Avenir-Medium",
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 24,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginPage;
