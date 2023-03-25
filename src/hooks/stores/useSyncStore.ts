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
export function useSetIndividualSync(deviceId: string) {
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
    [thisSync, setIndivdualSync(deviceId)]
  );
}
