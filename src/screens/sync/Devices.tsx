import * as React from "react";
import { Animated, View, StyleSheet } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Spacer } from "../../components/Spacer";
import { Text, styles as textStyles } from "../../components/Text";
import { colors, spacing } from "../../lib/styles";
import { Role, ViewMode } from ".";
import { ProgressBar } from "../../components/ProgressBar";
import { SyncGroupBottomSheetContent } from "../../components/SyncGroupBottomSheet";
import { Button } from "../../components/Button";
import {
  BottomSheetModal,
  useBottomSheetModal,
} from "../../components/BottomSheetModal";
import { DeviceInfo } from "./DeviceInfo";
import { generateData } from "../../lib/data";
import { Peer } from "../../sharedTypes";

const m = defineMessages({
  searching: {
    id: "screen.sync.Devices.searching",
    defaultMessage: "Searching for devices",
  },
  localDevices: {
    id: "screen.sync.main.localDevices",
    defaultMessage: "Local Devices",
  },
  localDeviceDescription: {
    id: "screen.sync.main.localDeviceDescription",
    defaultMessage:
      "These devices are on your project and on the same wifi network as you.",
  },
  sync: {
    id: "screen.sync.main.sync",
    defaultMessage: "Sync",
  },
  deviceName: {
    id: "screen.sync.main.deviceName",
    defaultMessage: "Device Name",
  },
  lastSynced: {
    id: "screen.sync.main.lastSynced",
    defaultMessage: "Last Synced",
  },
});

const animatedEllipsisStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  text: {
    fontSize: textStyles.large.fontSize,
    fontWeight: textStyles.bold.fontWeight,
    // Hacky way of getting ellipsis to vertically align at bottom
    marginBottom: -(textStyles.large.fontSize / 2),
  },
});

const AnimatedEllipsis = () => {
  const dots = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  React.useEffect(() => {
    let mounted = true;

    function animateDot(position: number) {
      if (!mounted) return;

      const targetDot = dots[position];
      const nextDotPosition = (position + 1) % 3;

      Animated.timing(targetDot, {
        toValue: 1,
        useNativeDriver: true,
        duration: 350,
      }).start(({ finished }) => {
        if (finished && nextDotPosition === 0) {
          dots.forEach((d) => {
            d.setValue(0);
          });
        }
        animateDot(nextDotPosition);
      });
    }

    animateDot(0);

    return () => {
      mounted = false;
      dots.forEach((d) => d.stopAnimation());
    };
  }, []);

  return (
    <View style={animatedEllipsisStyles.container}>
      {dots.map((opacity, index) => (
        <Animated.Text
          key={index}
          style={[animatedEllipsisStyles.text, { opacity }]}
        >
          .
        </Animated.Text>
      ))}
    </View>
  );
};

const deviceListStyles = StyleSheet.create({
  headerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.medium,
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  infoButton: {
    borderRadius: 10,
    borderColor: colors.GRAY,
    borderWidth: 1,
    backgroundColor: colors.WHITE,
    height: 20,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.medium,
  },
});

const DeviceList = ({
  peers,
  onDevicePress,
  onInfoPress,
}: {
  peers: Peer[];
  onDevicePress: (peer: Peer) => void;
  onInfoPress: () => void;
}) => {
  const { formatMessage: t } = useIntl();
  const [shouldStart, setShouldStart] = React.useState(false);

  return (
    <View>
      <View style={deviceListStyles.headerRowContainer}>
        <View style={deviceListStyles.headerTitleContainer}>
          <Text size="medium" bold>
            {t(m.localDevices)}
          </Text>
          <Spacer direction="horizontal" size={spacing.medium} />
          <TouchableOpacity
            style={deviceListStyles.infoButton}
            onPress={onInfoPress}
          >
            <MaterialIcon name="help" size={14} color={colors.DARK_GRAY} />
          </TouchableOpacity>
        </View>
        <Button
          iconName="lightning-bolt"
          onPress={() => setShouldStart(true)}
          text={t(m.sync)}
        />
      </View>
      <View style={deviceListStyles.listHeaderContainer}>
        <Text size="small" color={colors.DARK_GRAY}>
          {t(m.deviceName)}
        </Text>
        <Text size="small" color={colors.DARK_GRAY}>
          {t(m.lastSynced)}
        </Text>
      </View>
      {peers.map((peer) => (
        <ProgressBar
          key={peer.id}
          deviceId={peer.deviceId}
          deviceType={peer.deviceType}
          deviceName={peer.name}
          date={new Date(peer.lastSynced).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          syncGroup="local"
          shouldStart={shouldStart}
          style={{ marginTop: 10 }}
          onPress={() => onDevicePress(peer)}
        />
      ))}
    </View>
  );
};

export const Devices = ({ mode, role }: { mode: ViewMode; role: Role }) => {
  const { formatMessage: t } = useIntl();
  const [peers] = React.useState(generateData(10));

  const [status, setStatus] = React.useState<"loading" | "idle">("loading");

  const [modalMode, setModalMode] = React.useState<
    { type: "info" } | { type: "device"; data: Peer } | null
  >(null);

  const { sheetRef, closeSheet, openSheet } = useBottomSheetModal({
    openOnMount: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      setStatus("loading");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, [])
  );

  return (
    <>
      <View style={{ paddingVertical: spacing.large }}>
        {status === "loading" ? (
          <View>
            <Text size="large" bold textAlign="center">
              {t(m.searching)}
              <AnimatedEllipsis />
            </Text>
          </View>
        ) : mode === "list" ? (
          <DeviceList
            peers={peers}
            onInfoPress={() => {
              setModalMode({ type: "info" });
              openSheet();
            }}
            onDevicePress={(peer: Peer) => {
              setModalMode({ type: "device", data: peer });
              openSheet();
            }}
          />
        ) : null}
      </View>
      <BottomSheetModal
        ref={sheetRef}
        disableBackdropPress={modalMode?.type === "device"}
      >
        {!modalMode ? null : modalMode.type === "info" ? (
          <SyncGroupBottomSheetContent
            content={{
              title: t(m.localDevices),
              description: t(m.localDeviceDescription),
            }}
          />
        ) : modalMode.type === "device" ? (
          <DeviceInfo
            onClose={() => closeSheet()}
            role={role}
            peer={modalMode.data}
          />
        ) : null}
      </BottomSheetModal>
    </>
  );
};
