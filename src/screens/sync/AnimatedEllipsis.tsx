import * as React from "react";
import { Animated, View, StyleSheet } from "react-native";

import { styles as textStyles } from "../../components/Text";

export const AnimatedEllipsis = () => {
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
    <View style={styles.container}>
      {dots.map((opacity, index) => (
        <Animated.Text key={index} style={[styles.text, { opacity }]}>
          .
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
