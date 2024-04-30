// components/ProfileHeader.jsx
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileHeader = ({ user }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" size={100} color="#4c8bf5" />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
});

export default ProfileHeader;
