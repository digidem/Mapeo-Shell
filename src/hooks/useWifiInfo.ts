import { useNetInfo } from "@react-native-community/netinfo";
import { useCanAccessWifiSSID } from "./useCanAccessWifiSSID";

export function useWifiInfo() {
  const permissionEnabled = useCanAccessWifiSSID();
  const net = useNetInfo({ shouldFetchWiFiSSID: true });
  return {
    permissionEnabled,
    wifiConnected: net.type === "wifi" && net.isConnected,
    ssid: net.type === "wifi" ? net.details.ssid : null,
  };
}
