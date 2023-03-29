import { useMemo } from "react";
import { create } from "zustand";

type Progress = {
  completed: number;
  total: number;
};

type SyncGroup = "local" | "online";

type ActiveSync = {
  progress: Progress;
  syncIsFinished: boolean;
  syncGroup: SyncGroup;
};

type AllSyncs = Record<string, ActiveSync>;

type SyncStore = {
  allSyncs: AllSyncs;
  actions: {
    setIndividualSync: (
      deviceId: string,
      progress: Progress,
      syncGroup: SyncGroup
    ) => void;
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
    setIndividualSync: (deviceId, progress, syncGroup) =>
      set((state) => {
        return {
          allSyncs: {
            ...state.allSyncs,
            [deviceId]: {
              progress,
              syncIsFinished: progress.completed === progress.total,
              syncGroup,
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
 * @returns an array with [sync, setSync(completed:number)]
 */
export function useIndividualSync(
  deviceId: string,
  syncGroup: SyncGroup
): readonly [ActiveSync | undefined, () => void] {
  const thisSync = useSyncs()[deviceId];
  const setIndividualSync = useSyncAction().setIndividualSync;

  if (!thisSync) {
    const total = getRandomNumberMax30();
    setIndividualSync(deviceId, { total, completed: 0 }, syncGroup);
  }

  console.log(thisSync);

  return [
    thisSync,
    () =>
      setIndividualSync(
        deviceId,
        {
          total: thisSync.progress.total,
          completed: thisSync.progress.completed + 1,
        },
        syncGroup
      ),
  ] as const;
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
