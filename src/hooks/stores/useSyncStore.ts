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
  actions: {
    setIndividualSync: (deviceId: string, progress: Progress) => void;
    resetSyncStore: () => void;
  };
};

const emptyProgress: Progress = {
  completed: 0,
  total: 0,
};

const useSyncStore = create<SyncStore>()((set) => ({
  allSyncs: {},
  actions: {
    setIndividualSync: (deviceId, progress) =>
      set((state) => {
        return {
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
      set(() => ({
        allSyncs: {},
      })),
  },
}));

function useSyncAction() {
  return useSyncStore((state) => state.actions);
}

const useSyncs = () => {
  return useSyncStore((state) => state.allSyncs);
};

export function useIncompleteSyncs() {
  const allSyncs = useSyncs();
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
  const thisSync = useSyncs()[deviceId];
  const setIndividualSync = useSyncAction().setIndividualSync;

  if (!thisSync) {
    const total = getRandomNumberMax30();
    setIndividualSync(deviceId, { total, completed: 0 });
  }

  return useMemo(
    () =>
      [
        thisSync,
        (progress: Progress) => setIndividualSync(deviceId, progress),
      ] as const,
    [thisSync, setIndividualSync, deviceId]
  );
}

/**
 * @description calling this function will reset sync store. Should be used in cleanup when unmounting the sync screen
 */
export function useResetSyncStore() {
  return useSyncAction().resetSyncStore;
}

function getRandomNumberMax30() {
  return Math.floor(Math.random() * (30 - 1) + 1);
}
