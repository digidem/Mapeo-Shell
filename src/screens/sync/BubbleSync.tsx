import { useContext } from "react";
import { ScrollView } from "react-native";
import { SyncContext } from "../../contexts/SyncContext";

export const BubbleSync = () => {
  const [syncs] = useContext(SyncContext);

  const activeSyncs = Object.entries(syncs.local).some(
    ([keys, val]) => val === "active"
  );

  const bubbleImage = require("../../../assets/bubblesSyncing.png");

  return <ScrollView></ScrollView>;
};
