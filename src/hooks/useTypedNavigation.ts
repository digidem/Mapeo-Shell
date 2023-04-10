import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Screens } from "../navigation/NavigationContainer";

export const useTypedNavigation = () =>
  useNavigation<NativeStackNavigationProp<Screens>>();
