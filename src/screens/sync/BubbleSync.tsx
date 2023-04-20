import { useContext } from "react";
import { Image, Dimensions } from "react-native";
import { SyncContext } from "../../contexts/SyncContext";

export const BubbleSync = ({ show }: { show: boolean }) => {
  const [allSyncs] = useContext(SyncContext);

  const width = Dimensions.get("window").width;
  const height = Math.round((width * 620) / 371);

  const activeSyncs =
    Object.values(allSyncs.local).some((val) => val !== "idle") ||
    Object.values(allSyncs.internet).some((val) => val !== "idle");

  const bubbleImage = activeSyncs
    ? require("../../../assets/bubblesSyncing.png")
    : require("../../../assets/bubblesNotSyncing.png");

  return (
    <Image
      resizeMode="contain"
      style={[
        { width: undefined, height: height },
        show ? undefined : { display: "none" },
      ]}
      source={bubbleImage}
    />
  );
};
