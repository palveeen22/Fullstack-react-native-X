// components/SearchInput.jsx
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchInput = ({ value, onChangeText, onSearchSubmit }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#fff" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        placeholderTextColor="#ddd"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSearchSubmit}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={onSearchSubmit}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    borderColor: "#333",
    borderRightWidth: 1,
    paddingRight: 10,
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "500",
  },
});

export default SearchInput;
