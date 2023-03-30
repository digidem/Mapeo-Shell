import { useContext } from "react";
import { Platform } from "react-native";

import { PermissionsContext } from "../contexts/PermissionsContext";

// Access to the SSID with @react-native-community/netinfo requires
// user-enabling of android.permission.ACCESS_FINE_LOCATION,
// which can be achieved using expo-location (see PermissionsContext.tsx)
//
// https://github.com/react-native-netinfo/react-native-netinfo#type-is-wifi
// https://docs.expo.dev/versions/latest/sdk/netinfo/#accessing-the-ssid
export function useCanAccessWifiSSID() {
  const permissionsResponse = useContext(PermissionsContext);

  if (!(permissionsResponse && permissionsResponse.granted)) return false;

  return Platform.OS === "android"
    ? !!(permissionsResponse.android?.accuracy === "fine")
    : true;
}
