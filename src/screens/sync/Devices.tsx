import * as React from "react";
import { Animated, Pressable, View, StyleSheet } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Spacer } from "../../components/Spacer";
import { Text, styles as textStyles } from "../../components/Text";
import { colors, spacing } from "../../lib/styles";
import { ProgressBar } from "../../components/ProgressBar";
import { TitleAndDescription } from "../../components/SyncGroupBottomSheet";

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
  syncButton: {
    backgroundColor: colors.MAPEO_BLUE,
    borderRadius: 4,
    padding: spacing.medium,
    minWidth: 120,
  },
  syncButtonContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.medium,
  },
});

export const DeviceList = ({
  setAndOpenModal,
}: {
  setAndOpenModal: (content: TitleAndDescription) => void;
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
            onPress={() => {
              setAndOpenModal({
                title: m.localDevices.defaultMessage,
                description: m.localDeviceDescription.defaultMessage,
              });
            }}
            style={deviceListStyles.infoButton}
          >
            <MaterialIcon name="help" size={14} color={colors.DARK_GRAY} />
          </TouchableOpacity>
        </View>
        <Pressable
          onPress={() => setShouldStart(true)}
          android_ripple={{ radius: 100 }}
          style={deviceListStyles.syncButton}
        >
          <View style={deviceListStyles.syncButtonContentContainer}>
            <MaterialIcon
              name="lightning-bolt"
              size={20}
              color={colors.WHITE}
            />
            <Spacer direction="horizontal" size={spacing.medium} />
            <Text size="medium" color={colors.WHITE} bold>
              {t(m.sync)}
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={deviceListStyles.listHeaderContainer}>
        <Text size="small" color={colors.DARK_GRAY}>
          {t(m.deviceName)}
        </Text>
        <Text size="small" color={colors.DARK_GRAY}>
          {t(m.lastSynced)}
        </Text>
      </View>
      {[1].map((val) => (
        <ProgressBar
          key={val}
          deviceId={val.toString()}
          deviceType={val % 2 === 0 ? "desktop" : "mobile"}
          deviceName={"Example"}
          date="Feb 12, 2023"
          syncGroup="local"
          shouldStart={shouldStart}
          style={{ marginTop: 10 }}
        />
      ))}
    </View>
  );
};

export const Devices = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage: t } = useIntl();
  const [status, setStatus] = React.useState<"loading" | "idle">("loading");

  useFocusEffect(
    React.useCallback(() => {
      setStatus("loading");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, [])
  );

  return (
    <React.Fragment>
      <View style={{ paddingVertical: spacing.large }}>
        {status === "loading" ? (
          <View>
            <Text size="large" bold textAlign="center">
              {t(m.searching)}
              <AnimatedEllipsis />
            </Text>
          </View>
        ) : (
          children
        )}
      </View>
    </React.Fragment>
  );
};
