import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {
  IntlSetContext,
  SupportedLanguageName,
} from "../../contexts/IntlContext";
import { useContext } from "react";
import { Text } from "../../components/Text";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import { Role } from "../sync";
import { StyleSheet, View } from "react-native";
import { colors } from "../../lib/styles";

type SelectOneProps = {
  value: SupportedLanguageName;
  role: Role;
};

export const SelectOne = ({ value, role }: SelectOneProps) => {
  const [locale, selectLocale] = useContext(IntlSetContext);
  const { navigate } = useTypedNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        selectLocale(value.locale);
        navigate("Sync", { role });
      }}
    >
      <MaterialIcon
        name={
          locale === value.locale
            ? "radio-button-checked"
            : "radio-button-unchecked"
        }
        size={24}
        color="rgba(0, 0, 0, 0.54)"
      />

      <View style={{ marginLeft: 40 }}>
        <Text size="medium">{value.nativeName}</Text>
        <Text size="small" color={colors.DARK_GRAY}>
          {value.englishName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 20,
    alignItems: "center",
  },
});
