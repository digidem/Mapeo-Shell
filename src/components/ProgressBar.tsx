import * as Progress from "react-native-progress";
import { StyleSheet, View, Image, StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useSync } from "../hooks/useSync";
import { SyncContext } from "../contexts/SyncContext";
import { Text } from "./Text";
import { colors, spacing } from "../lib/styles";
import { Spacer } from "./Spacer";
import { Peer } from "../sharedTypes";
import { useContext, useRef, useState } from "react";

type ProgressBarProps = {
  peer: Peer;
  onPress: (isNotIdle: boolean, peer: Peer) => void;
  shouldStart: boolean;
  style?: StyleProp<ViewStyle>;
};

export const ProgressBar = ({
  peer,
  onPress,
  shouldStart,
  style,
}: ProgressBarProps) => {
  const { deviceId, deviceType, name, lastSynced, connectionType } = peer;
  const progress = useSync(peer.deviceId, connectionType, shouldStart);
  const [dateAfterSync, setDateAfterSync] = useState(false);
  const timeout = useRef<NodeJS.Timer>();
  const [allSyncs] = useContext(SyncContext);

  const completed = progress >= 1;

  const showDate = !shouldStart || dateAfterSync;

  if (completed && !dateAfterSync && !timeout.current) {
    timeout.current = setTimeout(() => {
      setDateAfterSync(true);
    }, 2000);
  }

  const dateToDisplay = (
    completed ? new Date() : new Date(lastSynced)
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isIdle = Object.values(allSyncs).some((val) => {
    return val[deviceId] && val[deviceId] === "idle";
  });

  const icon =
    deviceType === "desktop"
      ? require("../../assets/desktop.png")
      : require("../../assets/mobile.png");

  return (
    <TouchableOpacity style={style} onPress={() => onPress(isIdle, peer)}>
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
              {name}
            </Text>
          </View>
          {showDate ? (
            <Text size="small" color={colors.DARK_GRAY}>
              {dateToDisplay}
            </Text>
          ) : (
            <MaterialIcon
              name={completed ? "done" : "bolt"}
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
