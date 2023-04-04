import * as Progress from "react-native-progress";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useIndividualSync } from "../hooks/stores/useSyncStore";
import { useEffect, useRef, useState } from "react";

type ProgressBarProps = {
  deviceId: string;
  deviceName: string;
  shouldSync: boolean;
};

export const ProgressBar = ({ deviceId }: { deviceId: string }) => {
  const [thisSync, setThisSync] = useIndividualSync(deviceId, "local");

  return (
    <TouchableOpacity onPress={setThisSync}>
      <Progress.Bar
        color="rgba(0, 102, 255, 0.1)"
        progress={thisSync ? thisSync.completed / thisSync.total : 0}
        width={null}
        height={80}
      >
        <View style={styles.container}>
          <View>
            <Text>Tester</Text>
          </View>
          <Text>Tester</Text>
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
});
