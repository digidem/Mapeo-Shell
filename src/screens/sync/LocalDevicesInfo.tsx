import { StyleSheet, View, Image } from "react-native";
import { defineMessages, useIntl } from "react-intl";

import { Text } from "../../components/Text";
import { Spacer } from "../../components/Spacer";
import { BottomSheetContent } from "../../components/BottomSheetModal";

const m = defineMessages({
  localDevices: {
    id: "screen.sync.LocalDevicesInfo.localDevices",
    defaultMessage: "Local Devices",
  },
  localDeviceDescription: {
    id: "screen.sync.LocalDevicesInfo.localDeviceDescription",
    defaultMessage:
      "These devices are on your project and on the same wifi network as you.",
  },
});

export const LocalDevicesInfo = () => {
  const { formatMessage: t } = useIntl();

  return (
    <BottomSheetContent>
      <View style={styles.btmSheetContainer}>
        <Image
          style={{ height: 80, width: 80, resizeMode: "contain" }}
          source={require("../../../assets/questionMark.png")}
        />
        <Spacer size={20} direction="vertical" />
        <Text size="medium">{t(m.localDevices)}</Text>
        <Spacer size={20} direction="vertical" />
        <Text textAlign="center" size="small">
          {t(m.localDeviceDescription)}
        </Text>
      </View>
    </BottomSheetContent>
  );
};

const styles = StyleSheet.create({
  btmSheetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
