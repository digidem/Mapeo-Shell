import { defineMessages } from "react-intl";
import { View, Text } from "react-native";
import { ProgressBar } from "../../components/ProgressBar";
import { SyncScreenComponent } from "../../sharedTypes";

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
        <ProgressBar key={val} deviceId={val.toString()} />
      ))}
    </View>
  );
};

Bar.navTitle = m.title;
