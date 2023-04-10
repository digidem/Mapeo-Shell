import {
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export type SyncGroup = "local" | "online";

export type SyncStatus = "active" | "stopped" | "idle";

export type AllSyncs = Record<SyncGroup, Record<string, SyncStatus>>;

type SyncContextType = [
  allSyncs: AllSyncs,
  setAllSyncs: Dispatch<SetStateAction<AllSyncs>>
];

export const SyncContext = createContext<SyncContextType>([
  { local: {}, online: {} },
  () => {},
]);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const [allSyncs, setAllSyncs] = useState<AllSyncs>({ local: {}, online: {} });

  return (
    <SyncContext.Provider value={[allSyncs, setAllSyncs]}>
      {children}
    </SyncContext.Provider>
  );
};
