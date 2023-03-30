import { StyleSheet, Text as RNText, TextProps, TextStyle } from "react-native";

interface Props extends React.PropsWithChildren<Omit<TextProps, "style">> {
  bold?: boolean;
  color?: TextStyle["color"];
  size: "small" | "medium" | "large";
  textAlign?: TextStyle["textAlign"];
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 20,
  },
  large: {
    fontSize: 24,
  },
});

export const Text = ({
  children,
  bold,
  color,
  size,
  textAlign,
  ...rnTextProps
}: Props) => {
  return (
    <RNText
      {...rnTextProps}
      style={[
        styles[size],
        {
          textAlign,
          color,
          fontWeight: bold ? "500" : undefined,
        },
      ]}
    >
      {children}
    </RNText>
  );
};
