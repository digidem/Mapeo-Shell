import * as React from "react";
import { View } from "react-native";

interface Props {
  direction: "vertical" | "horizontal";
  size: number;
}

export const Spacer = ({ direction, size }: Props) => (
  <View
    style={direction === "horizontal" ? { width: size } : { height: size }}
  />
);
