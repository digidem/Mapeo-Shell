import * as React from "react";
import { Animated, View, StyleSheet } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { useFocusEffect } from "@react-navigation/native";

import { Text, styles as textStyles } from "../../components/Text";
import { spacing } from "../../lib/styles";

const m = defineMessages({
  searching: {
    id: "screen.sync.DevicesList.searching",
    defaultMessage: "Searching for devices",
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

const devicesListStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing.large,
  },
});

export const DevicesList = () => {
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
