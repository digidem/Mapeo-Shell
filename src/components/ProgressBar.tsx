import * as Progress from "react-native-progress";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSync } from "../hooks/useSyncs";

type ProgressBarProps = {
  deviceId: string;
  deviceName: string;
  deviceType: "desktop" | "mobile";
  date: string;
  shouldSync: boolean;
};

export const ProgressBar = ({
  deviceId,
  deviceName,
  date,
  shouldSync,
  deviceType,
}: ProgressBarProps) => {
  const [thisSync, incrementSync] = useSync(deviceId, "local");

  const icon =
    deviceType === "desktop"
      ? require("../../assets/desktop.png")
      : require("../../assets/mobile.png");

  return (
    <TouchableOpacity onPress={incrementSync}>
      <Progress.Bar
        color="rgba(0, 102, 255, 0.1)"
        progress={!thisSync ? 0 : thisSync.completed / thisSync.total}
        width={null}
        height={100}
      >
        <View style={styles.container}>
          <View style={styles.nameAndIcon}>
            <Image
              style={{ height: 80, width: 80, resizeMode: "contain" }}
              source={icon}
            />
            <Text style={{ margin: 10 }}>{deviceName}</Text>
          </View>
          <Text style={{ fontSize: 12 }}>{date}</Text>
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
