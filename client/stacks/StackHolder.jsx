// stacks/StackHolder.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddPostPage from "../screens/AddPostPage";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";
import SearchPage from "../screens/SearchPage";
import { LoginContext } from "../contexts/LoginContext";
import TabBarIcon from "../components/TabBarIcon";
import HomeStackNavigator from "./StackHome";
import UserProfilePage from "../screens/UserProfilePage";

const Tab = createBottomTabNavigator();

const StackHolder = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabBarIcon routeName={route.name} focused={focused} />
          ),
        })}
      >
        {isLoggedIn ? (
          <>
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="AddPost" component={AddPostPage} />
            <Tab.Screen name="Search" component={SearchPage} />
            <Tab.Screen name="UserProfile" component={UserProfilePage} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={LoginPage} />
            <Tab.Screen name="Register" component={RegisterPage} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default StackHolder;
