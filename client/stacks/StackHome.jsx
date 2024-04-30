// stacks/StackHome.jsx
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "../screens/HomePage";
import PostDetailsPage from "../screens/PostDetailsPage";

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="How's Going On Today?" component={HomePage} />
    <HomeStack.Screen name="PostDetails" component={PostDetailsPage} />
  </HomeStack.Navigator>
);

export default HomeStackNavigator;
