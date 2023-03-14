import { defineMessages } from "react-intl";
import { View, Text } from "react-native";
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
    </View>
  );
};

Bar.navTitle = m.title;
