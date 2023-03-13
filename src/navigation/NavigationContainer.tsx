import { NavigationContainer as NativeNavContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Home } from "../screens/Home";

type Drawers = {
  Home: undefined;
};

const Drawer = createDrawerNavigator<Drawers>();

export const NavigationContainer = () => {
  return (
    <NativeNavContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </NativeNavContainer>
  );
};
