import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {
  IntlSetContext,
  LanguageName,
  TranslatedLocales,
} from "../../contexts/IntlContext";
import { useContext } from "react";
import { Text } from "../../components/Text";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import { Role } from "../sync";

type SelectOneProps = {
  value: Omit<LanguageName, "locale"> & { locale: TranslatedLocales };
  role: Role;
};

export const SelectOne = ({ value, role }: SelectOneProps) => {
  const [locale, selectLocale] = useContext(IntlSetContext);
  const { navigate } = useTypedNavigation();
  return (
    <TouchableOpacity
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

      <Text size="medium">{value.nativeName}</Text>
      <Text size="medium">{value.englishName}</Text>
    </TouchableOpacity>
  );
};
