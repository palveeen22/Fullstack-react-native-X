// screens/HomePage.jsx
import { useState, useCallback } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { GET_POSTS } from "../queries";
import Post from "../components/Post";

const HomePage = ({ navigation }) => {
  const client = useApolloClient();
  const { data, loading, error } = useQuery(GET_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await client.resetStore();
    } catch (error) {
      console.error("Error on cache reset:", error);
    }
    setRefreshing(false);
  }, [client]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.getPosts?.data || []}
        renderItem={({ item }) => <Post {...item} navigation={navigation} />}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {loading && <ActivityIndicator size="large" color="#fff" />}
      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  error: {
    color: "red",
    fontSize: 16,
    padding: 20,
    textAlign: "center",
  },
});

export default HomePage;
