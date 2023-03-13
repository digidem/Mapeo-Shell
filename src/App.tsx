import { registerRootComponent } from "expo";
import { NavigationContainer } from "./navigation/NavigationContainer";
import "react-native-gesture-handler";

export default function App() {
  return <NavigationContainer />;
}

registerRootComponent(App);
