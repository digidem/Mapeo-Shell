import * as React from "react";

import { Peer } from "../../../sharedTypes";
import { Role } from "../";
import { RemoveDeviceConfirmation } from "./RemoveDeviceConfirmation";
import { DeviceInfo } from "./DeviceInfo";

interface Props {
  onClose: () => void;
  role: Role;
  peer: Peer;
}

export const DeviceBottomSheetContent = ({ onClose, peer, role }: Props) => {
  const [mode, setMode] = React.useState<"info" | "remove">("info");
  return mode === "info" ? (
    <DeviceInfo
      peer={peer}
      role={role}
      onClose={onClose}
      onRemove={() => setMode("remove")}
    />
  ) : (
    <RemoveDeviceConfirmation
      onCancel={onClose}
      onConfirm={() => onClose()}
      peer={peer}
    />
  );
};
