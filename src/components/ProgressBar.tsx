import * as Progress from "react-native-progress";
import { StyleSheet, View, Image, StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useSync } from "../hooks/useSync";
import { SyncGroup } from "../contexts/SyncContext";
import { Text } from "./Text";
import { colors, spacing } from "../lib/styles";
import { Spacer } from "./Spacer";
import { DeviceType } from "../screens/sync/Devices";
import { DeviceInfo } from "./DeviceInfoSyncingContent";

type ProgressBarProps = {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  date: string;
  syncGroup: SyncGroup;
  shouldStart: boolean;
  style?: StyleProp<ViewStyle>;
  setDeviceModal: (content: DeviceInfo) => void;
};

export const ProgressBar = ({
  deviceId,
  deviceName,
  date,
  deviceType,
  syncGroup,
  shouldStart,
  style,
  setDeviceModal,
}: ProgressBarProps) => {
  const progress = useSync(deviceId, syncGroup, shouldStart);

  const icon =
    deviceType === "desktop"
      ? require("../../assets/desktop.png")
      : require("../../assets/mobile.png");

  return (
    <TouchableOpacity
      style={style}
      onPress={() => {
        setDeviceModal({ deviceId, deviceName, deviceType });
      }}
    >
      <Progress.Bar
        color="rgba(0, 102, 255, 0.1)"
        progress={progress}
        width={null}
        height={100}
      >
        <View style={styles.container}>
          <View style={styles.nameAndIcon}>
            <Image
              style={{ height: 80, width: 80, resizeMode: "contain" }}
              source={icon}
            />
            <Spacer direction="horizontal" size={spacing.medium} />
            <Text size="small" bold>
              {deviceName}
            </Text>
          </View>
          {!shouldStart ? (
            <Text size="small" color={colors.DARK_GRAY}>
              {date}
            </Text>
          ) : (
            <MaterialIcon
              name={progress >= 1 ? "done" : "bolt"}
              size={45}
              color={colors.DARK_GRAY}
            />
          )}
        </View>
      </Progress.Bar>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  nameAndIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
