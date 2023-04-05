import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

type Progress = {
  completed: number;
  total: number;
};

export type SyncGroup = "local" | "online";

type ActiveSync = {
  progress: Progress;

  syncGroup: SyncGroup;
};

type AllSyncs = Record<string, ActiveSync>;

type SyncContextType = {
  allSyncs: AllSyncs;
  setIndividualSync: (
    deviceId: string,
    progress: Progress,
    syncGroup: SyncGroup
  ) => void;
  incrementSync: (deviceId: string) => void;
};

export const SyncContext = createContext<SyncContextType>({
  allSyncs: {},
  setIndividualSync: () => {},
  incrementSync: () => {},
});

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const [allSyncs, setAllSyncs] = useState<AllSyncs>({});

  const setIndividualSync = useCallback(
    (deviceId: string, progress: Progress, syncGroup: SyncGroup) => {
      setAllSyncs((val) => ({
        ...val,
        [deviceId]: {
          ...val[deviceId],
          syncGroup,
          progress,
        },
      }));
    },
    []
  );

  const incrementSync = useCallback((deviceId: string) => {
    setAllSyncs((val) => ({
      ...val,
      [deviceId]: {
        ...val[deviceId],
        progress: {
          total: val[deviceId].progress.total,
          completed: val[deviceId].progress.completed + 1,
        },
      },
    }));
  }, []);

  const contextValue = useMemo(
    () => ({ allSyncs, setIndividualSync, incrementSync }),
    [allSyncs, setIndividualSync]
  );

  return (
    <SyncContext.Provider value={contextValue}>{children}</SyncContext.Provider>
  );
};
