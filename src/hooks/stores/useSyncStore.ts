import { useMemo } from "react";
import { create } from "zustand";

type Progress = {
  completed: number;
  total: number;
};

type ActiveSync = {
  progress: Progress;
  syncIsFinished: boolean;
};

type AllSyncs = Record<string, ActiveSync>;

type SyncStore = {
  allSyncs: AllSyncs;
  setIndivdualSync: (deviceId: string, progress?: Progress) => void;
  resetSyncStore: () => void;
};

const emptyProgress: Progress = {
  completed: 0,
  total: 0,
};

const useSyncStore = create<SyncStore>()((set) => ({
  allSyncs: {},
  setIndivdualSync: (deviceId, progress) =>
    set((state) => {
      if (!progress) {
        return {
          ...state,
          allSyncs: {
            ...state.allSyncs,
            [deviceId]: {
              syncIsFinished: state.allSyncs[deviceId].syncIsFinished || false,
              progress: state.allSyncs[deviceId].progress || emptyProgress,
            },
          },
        };
      }

      return {
        ...state,
        allSyncs: {
          ...state.allSyncs,
          [deviceId]: {
            progress,
            syncIsFinished: progress.completed === progress.total,
          },
        },
      };
    }),
  resetSyncStore: () =>
    set((state) => ({
      ...state,
      allSyncs: {},
    })),
}));

export function useIncompleteSyncs() {
  const allSyncs = useSyncStore((state) => state.allSyncs);
  return useMemo(
    () =>
      Object.entries(allSyncs)
        .filter(([, values]) => !values.syncIsFinished)
        .map(([key]) => allSyncs[key]),
    [allSyncs]
  );
}

/**
 *
 * @param deviceId
 * @returns an array with [sync, setSync]
 */
export function useIndividualSync(deviceId: string) {
  const allSyncs = useSyncStore((state) => state.allSyncs);
  const setIndivdualSync = useSyncStore((store) => store.setIndivdualSync);

  const thisSync = useMemo(() => allSyncs[deviceId], [allSyncs, deviceId]);
  if (!thisSync) {
    setIndivdualSync(deviceId);
  }

  return useMemo(
    () =>
      [
        thisSync,
        (progress: Progress) => setIndivdualSync(deviceId, progress),
      ] as const,
    [thisSync, setIndivdualSync, deviceId]
  );
}

/**
 * @description calling this function will reset sync store. Should be used in cleanup when unmounting the sync screen
 */
export function useResetSyncStore() {
  return useSyncStore((store) => store.resetSyncStore);
}
