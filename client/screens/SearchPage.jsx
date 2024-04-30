// screens/SearchPage.jsx
import { useState, useContext } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLazyQuery, useMutation } from "@apollo/client";
import SearchInput from "../components/SearchInput";
import { SEARCH_USER, FOLLOW_USER } from "../queries";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LoginContext } from "../contexts/LoginContext";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoggedIn, userId } = useContext(LoginContext);
  const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: "network-only",
  });
  const [followUser] = useMutation(FOLLOW_USER);
  const [followedUsers, setFollowedUsers] = useState({});

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      searchUsers({ variables: { username: searchTerm.trim() } });
    } else {
      Alert.alert("Search term cannot be empty");
    }
  };

  const handleFollowUser = (followUserId) => {
    if (!isLoggedIn) {
      Alert.alert("Error", "You must be logged in to follow users.");
      return;
    }
    if (followedUsers[followUserId]) {
      Alert.alert("Info", "You are already following this user.");
      return;
    }
    followUser({
      variables: { userId, followUserId },
      onCompleted: () => {
        Alert.alert("Success", "User followed successfully!");
        setFollowedUsers({ ...followedUsers, [followUserId]: true });
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to follow user. " + error.message);
      },
    });
  };

  return (
    <View style={styles.container}>
      <SearchInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      <FlatList
        data={data?.searchUsersByUsername || []}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Ionicons
              name="person"
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => handleFollowUser(item._id)}
              disabled={followedUsers[item._id]}
            >
              <Text style={styles.followButtonText}>
                {followedUsers[item._id] ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={
          !loading &&
          !error && <Text style={styles.infoText}>No users found.</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 10,
  },
  infoText: {
    color: "#ffffff",
    textAlign: "center",
    margin: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 10,
  },
  userItem: {
    backgroundColor: "#181818",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: "#fff",
  },
  username: {
    color: "#fff",
    fontSize: 16,
  },
  followButton: {
    backgroundColor: "#4c8bf5",
    padding: 8,
    borderRadius: 5,
    marginLeft: "auto",
  },
  followButtonText: {
    color: "#fff",
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default SearchPage;
