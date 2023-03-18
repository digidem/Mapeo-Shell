import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { BLACK } from "../lib/styles";

export const CustomHeaderRight = ({
  toggleDrawer,
}: {
  toggleDrawer: () => void;
}) => {
  return (
    <TouchableOpacity onPress={toggleDrawer}>
      <MaterialIcon name="menu" color={BLACK} size={30} />
    </TouchableOpacity>
  );
};
