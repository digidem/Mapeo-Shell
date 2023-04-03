import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { BLACK } from "../lib/styles";

export const CustomHeaderRight = ({
  onPress,
  iconName,
}: {
  iconName: React.ComponentPropsWithoutRef<typeof MaterialIcon>["name"];
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcon name={iconName} color={BLACK} size={30} />
    </TouchableOpacity>
  );
};
