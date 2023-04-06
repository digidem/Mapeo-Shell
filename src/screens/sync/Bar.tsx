import { defineMessages } from "react-intl";
import { View, Text } from "react-native";
import { ProgressBar } from "../../components/ProgressBar";
import { SyncScreenComponent } from "../../sharedTypes";
import { SyncProvider } from "../../contexts/SyncContext";
import { useActiveSync } from "../../hooks/useSyncs";

const m = defineMessages({
  title: {
    id: "screen.sync.bar",
    defaultMessage: "Bar Sync",
  },
});

export const Bar: SyncScreenComponent<"Bar"> = () => {
  return (
    <View>
      <Text>Bar Sync</Text>
      {[1, 2, 3, 4, 5, 6, 23, 25, 26, 71, 324, 234].map((val) => (
        <ProgressBar
          key={val}
          deviceId={val.toString()}
          deviceType={val % 2 == 0 ? "desktop" : "mobile"}
          deviceName={`Device #${val}`}
          date="Feb 12, 2023"
          shouldSync={false}
        />
      ))}
    </View>
  );
};

Bar.navTitle = m.title;
