// components/LogoutButton.jsx
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const LogoutButton = ({ onLogout }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onLogout}>
      <Ionicons name="exit-outline" size={20} color="#000" />
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default LogoutButton;
