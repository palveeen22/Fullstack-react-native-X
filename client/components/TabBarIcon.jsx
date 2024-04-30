// components/TabBarIcon.jsx
import Ionicons from "react-native-vector-icons/Ionicons";

const TabBarIcon = ({ routeName, focused }) => {
  let iconName;
  const icons = {
    Login: focused ? "log-in" : "log-in-outline",
    Home: focused ? "home" : "home-outline",
    Register: focused ? "person-add" : "person-add-outline",
    AddPost: focused ? "add-circle" : "add-circle-outline",
    Search: focused ? "search" : "search-outline",
    UserProfile: focused ? "person" : "person-outline",
  };

  iconName = icons[routeName] || "alert-circle-outline";
  return (
    <Ionicons name={iconName} size={25} color={focused ? "#000" : "#657786"} />
  );
};

export default TabBarIcon;
