import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import {
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { Text, styles as textStyles } from "../../components/Text";
import { useWifiInfo } from "../../hooks/useWifiInfo";
import { colors, spacing } from "../../lib/styles";
import { SyncScreenComponent } from "../../sharedTypes";

const m = defineMessages({
  navTitle: {
    id: "screen.sync.main.navTitle",
    defaultMessage: "Synchronize",
  },
  searching: {
    id: "screen.sync.main.searching",
    defaultMessage: "Searching for devices",
  },
  noConnection: {
    id: "screen.sync.main.noConnection",
    defaultMessage: "No connection",
  },
  connectedNoNetworkName: {
    id: "screen.sync.main.connectedNoNetworkName",
    defaultMessage: "Connected (no network name)",
  },
});

const LOGO_RADIUS = 50;

const projectInfoCardStyles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: colors.WHITE,
  },

  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
    padding: spacing.large / 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  connectionInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  wifiIconContainer: {
    marginRight: spacing.medium,
  },

  ssidContainer: { flex: 1 },

  logoImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.large,
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: LOGO_RADIUS * 2,
    width: LOGO_RADIUS * 2,
    height: LOGO_RADIUS * 2,
  },

  logoImage: { padding: 20 },

  bodyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.large * 1.5,
    paddingHorizontal: spacing.large / 2,
  },
});

const screenStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.LIGHT_GRAY,
  },

  scrollContentContainer: {
    padding: spacing.large,
  },

  searchingText: {
    fontSize: 24,
    fontWeight: "500",
  },
});

const WifiIcon = ({ active }: { active?: boolean }) => {
  return (
    <MaterialIcon
      color={colors.WHITE}
      style={{
        backgroundColor: colors.DARK_BLUE,
        padding: spacing.small,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
      name={active ? "wifi" : "wifi-strength-off"}
      size={16}
    />
  );
};

const TAB_SIZE = 36;

const viewSwitchStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 6,
    padding: spacing.small / 2,
    backgroundColor: colors.DARK_GRAY,
  },
  innerContainer: {
    flexDirection: "row",
  },
  baseTab: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    height: TAB_SIZE,
    width: TAB_SIZE,
  },
});

const ViewSwitch = ({
  value,
  toggle,
}: {
  value: "list" | "bubbles";
  toggle: () => void;
}) => {
  return (
    <TouchableWithoutFeedback
      onPress={toggle}
      style={viewSwitchStyles.container}
    >
      <View style={viewSwitchStyles.innerContainer}>
        <View
          style={[
            viewSwitchStyles.baseTab,

            value === "list"
              ? {
                  elevation: 5,
                  backgroundColor: colors.WHITE,
                }
              : undefined,
          ]}
        >
          <MaterialIcon
            name="format-list-bulleted-square"
            size={TAB_SIZE / 1.5}
          />
        </View>
        <View style={{ width: spacing.small }}></View>
        <View
          style={[
            viewSwitchStyles.baseTab,
            value === "bubbles"
              ? {
                  elevation: 5,
                  backgroundColor: colors.WHITE,
                }
              : undefined,
          ]}
        >
          <MaterialIcon name="graphql" size={TAB_SIZE / 1.5} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const ProjectInfoCard = ({
  name,
  viewMode,
  toggleViewMode,
}: {
  name: string;
  viewMode: "list" | "bubbles";
  toggleViewMode: () => void;
}) => {
  const { formatMessage: t } = useIntl();
  const { permissionEnabled, ssid, wifiConnected } = useWifiInfo();

  return (
    <View style={projectInfoCardStyles.container}>
      <View style={projectInfoCardStyles.titleContainer}>
        <View style={projectInfoCardStyles.connectionInfoContainer}>
          <View style={projectInfoCardStyles.wifiIconContainer}>
            <WifiIcon active={wifiConnected} />
          </View>
          <View style={projectInfoCardStyles.ssidContainer}>
            <TouchableWithoutFeedback
              onPress={
                permissionEnabled ? undefined : () => Linking.openSettings()
              }
            >
              <Text size="small" bold numberOfLines={1}>
                {wifiConnected
                  ? ssid || t(m.connectedNoNetworkName)
                  : t(m.noConnection)}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <ViewSwitch value={viewMode} toggle={toggleViewMode} />
      </View>
      <View style={projectInfoCardStyles.bodyContainer}>
        <View style={projectInfoCardStyles.logoImageContainer}>
          <Image
            // TODO: Use better res asset
            source={require("../../../assets/cards.png")}
            style={projectInfoCardStyles.logoImage}
          />
        </View>
        <Text size="medium" bold>
          {name}
        </Text>
      </View>
    </View>
  );
};

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

const devicesListStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing.large,
  },
});

const DevicesList = () => {
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
    <View style={devicesListStyles.container}>
      {status === "loading" ? (
        <View>
          <Text size="large" bold textAlign="center">
            {t(m.searching)}
            <AnimatedEllipsis />
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export const Main: SyncScreenComponent<"Main"> = () => {
  const [viewMode, setViewMode] = React.useState<"list" | "bubbles">("list");

  return (
    <ScrollView
      style={screenStyles.container}
      contentContainerStyle={screenStyles.scrollContentContainer}
    >
      <ProjectInfoCard
        name="Project Catapult"
        viewMode={viewMode}
        toggleViewMode={() => {
          setViewMode((prev) => (prev === "list" ? "bubbles" : "list"));
        }}
      />
      <DevicesList />
    </ScrollView>
  );
};

Main.navTitle = m.navTitle;
