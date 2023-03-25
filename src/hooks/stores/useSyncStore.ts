import { useMemo } from "react";
import { create } from "zustand";

type Progress = {
  completed: number;
  total: number;
};

type ActiveSync = {
  upload: Progress;
  download: Progress;
  isCompleted: boolean;
};

type AllSyncs = Record<string, ActiveSync>;

type SyncStore = {
  allSyncs: AllSyncs;
  setIndivdualSync: (
    deviceId: string,
    upload?: Progress,
    download?: Progress
  ) => void;
  resetSyncStore: () => void;
};

const useSyncStore = create<SyncStore>()((set) => ({
  allSyncs: {},
  setIndivdualSync: (deviceId, upload, download) =>
    set((state) => ({
      ...state,
      allSyncs: {
        ...state.allSyncs,
        [deviceId]: {
          isCompleted:
            !upload || !download
              ? false
              : upload.completed === upload.total &&
                download.completed === download.total,
          upload: upload || { completed: 0, total: 0 },
          download: download || { completed: 0, total: 0 },
        },
      },
    })),
  resetSyncStore: () =>
    set((state) => ({
      ...state,
      allSyncs: {},
    })),
}));

export function useIncompleteSyncs() {
  const allSyncs = useSyncStore((state) => state.allSyncs);
  return Object.entries(allSyncs)
    .filter(([, values]) => !values.isCompleted)
    .map(([key]) => allSyncs[key]);
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
        (upload: Progress, download: Progress) =>
          setIndivdualSync(deviceId, upload, download),
      ] as const,
    [thisSync, setIndivdualSync, deviceId]
  );
}

/**
 * @description calling this function will reset sync store. Should be used in cleanup when unmounting the sync screen
 */
export function useResetSyncStore() {
  useSyncStore((store) => store.resetSyncStore)();
}
