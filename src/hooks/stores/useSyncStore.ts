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
  intervals: Record<string, NodeJS.Timer>;
  actions: {
    setIndividualSync: (
      deviceId: string,
      progress: Progress,
      syncGroup: SyncGroup
    ) => void;
    resetSyncStore: () => void;
    setSyncInterval: (deviceId: string) => void;
    clearSyncInterval: (deviceId: string) => void;
    clearAllIntervals: () => void;
  };
};

const useSyncStore = create<SyncStore>()((set, get) => ({
  allSyncs: {},
  intervals: {},
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
    setSyncInterval: async (deviceId) => {
      // if sync has already been initiated do nothing
      if (get().intervals[deviceId] !== undefined) return;
      const interval: NodeJS.Timer = setInterval(
        () =>
          set((state) => {
            const incrementedCompleted =
              state.allSyncs[deviceId].progress.completed + 1;
            if (state.allSyncs[deviceId].syncIsFinished) {
              state.actions.clearSyncInterval(deviceId);
            }
            return {
              intervals: {
                ...state.intervals,
                [deviceId]: interval,
              },
              allSyncs: {
                ...state.allSyncs,
                [deviceId]: {
                  progress: {
                    total: state.allSyncs[deviceId].progress.total,
                    completed: incrementedCompleted,
                  },
                  syncIsFinished:
                    incrementedCompleted >=
                    state.allSyncs[deviceId].progress.total,
                  syncGroup: state.allSyncs[deviceId].syncGroup,
                },
              },
            };
          }),
        10
      );
    },
    clearSyncInterval: (deviceId) => {
      set((state) => {
        clearInterval(state.intervals[deviceId]);
        const { [deviceId]: key, ...rest } = state.intervals;
        return {
          intervals: rest,
        };
      });
    },
    clearAllIntervals: () => {
      Object.keys(get().intervals).map((key) => {
        get().actions.clearSyncInterval(key);
      });
    },
  },
}));

function useSyncAction() {
  return useSyncStore((state) => state.actions);
}

const useSyncs = () => {
  return useSyncStore((state) => state.allSyncs);
};

export function useIncompleteSyncGroup(syncGroup: SyncGroup) {
  const allSyncs = useSyncs();
  return useMemo(
    () =>
      Object.entries(allSyncs)
        .filter(
          ([, values]) =>
            values.syncGroup === syncGroup && !values.syncIsFinished
        )
        .map(([key]) => allSyncs[key]),
    [allSyncs, syncGroup]
  );
}

/**
 *
 * @param deviceId
 * @returns [progress, startSync]
 */
export function useIndividualSync(
  deviceId: string,
  syncGroup: SyncGroup
): readonly [Progress | undefined, () => void] {
  const thisSync = useSyncs()[deviceId];
  const setIndividualSync = useSyncAction().setIndividualSync;
  const setInterval = useSyncAction().setSyncInterval;

  if (!thisSync) {
    const total = getRandomNumberMax30();
    setIndividualSync(deviceId, { total, completed: 0 }, syncGroup);
  }

  return useMemo(
    () =>
      [
        !thisSync ? undefined : thisSync.progress,
        () => {
          setInterval(deviceId);
        },
      ] as const,
    [thisSync, deviceId, setInterval]
  );
}

/**
 * @description calling this function will reset sync store. Should be used in cleanup when unmounting the sync screen
 */
export function useSyncStoreCleanup() {
  return () => {
    useSyncAction().resetSyncStore();
    useSyncAction().clearAllIntervals();
  };
}

function getRandomNumberMax30() {
  return Math.floor(Math.random() * (30 - 1) + 1);
}
