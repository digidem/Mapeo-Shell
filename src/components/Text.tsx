import { StyleSheet, Text as RNText, TextProps, TextStyle } from "react-native";

interface Props extends React.PropsWithChildren<Omit<TextProps, "style">> {
  bold?: boolean;
  color?: TextStyle["color"];
  size: "small" | "smallMedium" | "medium" | "large";
  textAlign?: TextStyle["textAlign"];
  style?: TextStyle;
}

export const styles = StyleSheet.create({
  small: { fontSize: 14 },
  smallMedium: { fontSize: 16 },
  medium: { fontSize: 20 },
  large: { fontSize: 24 },
  bold: { fontWeight: "500" },
});

export const Text = ({
  children,
  bold,
  color,
  size,
  textAlign,
  style,
  ...rnTextProps
}: Props) => {
  return (
    <RNText
      {...rnTextProps}
      style={[
        style,
        styles[size],
        {
          textAlign,
          color,
          fontWeight: bold ? styles.bold.fontWeight : undefined,
        },
      ]}
    >
      {children}
    </RNText>
  );
};
