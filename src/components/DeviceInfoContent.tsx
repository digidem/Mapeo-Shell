import { StyleSheet, View, Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useContext, useMemo } from "react";

import { Text } from "./Text";
import { Spacer } from "./Spacer";
import { DeviceType } from "../screens/sync/Devices";
import { SyncContext } from "../contexts/SyncContext";
import { colors } from "../lib/styles";

export type DeviceInfo = {
  deviceType: DeviceType;
  deviceName: string;
  deviceId: string;
};

export const DeviceInfoContent = ({ content }: { content: DeviceInfo }) => {
  const [allSyncs] = useContext(SyncContext);

  const isSyncing =
    allSyncs.local[content.deviceId] === "active" ||
    allSyncs.online[content.deviceId] === "active";

  console.log({ isSyncing });

  const icon =
    content.deviceType === "desktop"
      ? require("../../assets/desktop.png")
      : require("../../assets/mobile.png");
  return (
    <View style={styles.btmSheetContainer}>
      <View>
        <View>
          <Image
            style={{ height: 80, width: 80, resizeMode: "contain" }}
            source={icon}
          />
          <Spacer size={20} direction="horizontal" />
          <Text size="medium">{content.deviceName}</Text>
          <Text size="medium">{content.deviceType}</Text>
          <Text size="medium">{content.deviceId}</Text>
        </View>
        <Spacer size={20} direction="horizontal" />
        {isSyncing && (
          <MaterialIcon name={"bolt"} size={45} color={colors.DARK_GRAY} />
        )}
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  btmSheetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
