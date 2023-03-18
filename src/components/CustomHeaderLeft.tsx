import React from "react";
import { HeaderBackButton } from "@react-navigation/elements";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { HeaderBackButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";

import { BLACK } from "../lib/styles";

interface CustomHeaderLeftProps {
  tintColor?: string;
  headerBackButtonProps: HeaderBackButtonProps;
  goBack: () => void;
}

export const CustomHeaderLeft = ({
  tintColor,
  headerBackButtonProps,
  goBack,
}: CustomHeaderLeftProps) => {
  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      style={{ marginLeft: 0, marginRight: 15 }}
      backImage={() => (
        <MaterialIcon name="arrow-back" color={tintColor || BLACK} size={30} />
      )}
      onPress={goBack}
    />
  );
};
