import { useNetInfo } from "@react-native-community/netinfo";
import { useCanAccessWifiSSID } from "./useCanAccessWifiSSID";

export function useWifiInfo() {
  const permissionEnabled = useCanAccessWifiSSID();
  const net = useNetInfo({ shouldFetchWiFiSSID: true });
  return {
    permissionEnabled,
    ssid: net.type === "wifi" && net.isConnected ? net.details.ssid : null,
  };
}
