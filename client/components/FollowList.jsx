// components/FollowList.jsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FollowList = ({
  user,
  showFollowers,
  setShowFollowers,
  showFollowing,
  setShowFollowing,
}) => {
  const followers = user?.followers || [];
  const following = user?.following || [];

  console.log("FollowList", user, followers, following);

  return (
    <View style={styles.followersFollowingContainer}>
      <View style={styles.followersContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowFollowers(!showFollowers)}
        >
          <Text style={styles.toggleButtonText}>
            {showFollowers ? "Hide Followers" : "Followers"}
          </Text>
        </TouchableOpacity>
        {showFollowers && (
          <View style={styles.followersList}>
            {followers.map((follower) => (
              <Text key={follower._id} style={styles.follower}>
                {follower.username}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View style={styles.followingContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowFollowing(!showFollowing)}
        >
          <Text style={styles.toggleButtonText}>
            {showFollowing ? "Hide Following" : "Following"}
          </Text>
        </TouchableOpacity>
        {showFollowing && (
          <View style={styles.followingList}>
            {following.map((followed) => (
              <Text key={followed._id} style={styles.followed}>
                {followed.username}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  followersFollowingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  followersContainer: {
    flex: 1,
    padding: 12,
  },
  followingContainer: {
    flex: 1,
    padding: 12,
  },
  toggleButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Avenir-Medium",
  },
  followersList: {
    marginTop: 10,
  },
  followingList: {
    marginTop: 10,
  },
  follower: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Avenir-Medium",
    marginBottom: 4,
  },
  followed: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Avenir-Medium",
    marginBottom: 4,
  },
});

export default FollowList;
