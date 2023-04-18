import {
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { ConnectionType } from "../sharedTypes";

export type SyncStatus = "active" | "stopped" | "idle";

export type AllSyncs = Record<ConnectionType, Record<string, SyncStatus>>;

type SyncContextType = [
  allSyncs: AllSyncs,
  setAllSyncs: Dispatch<SetStateAction<AllSyncs>>
];

export const SyncContext = createContext<SyncContextType>([
  { local: {}, internet: {} },
  () => {},
]);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const [allSyncs, setAllSyncs] = useState<AllSyncs>({
    local: {},
    internet: {},
  });

  return (
    <SyncContext.Provider value={[allSyncs, setAllSyncs]}>
      {children}
    </SyncContext.Provider>
  );
};
