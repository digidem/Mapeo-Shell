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

type UploadOrDownload =
  | { upload: Progress; download?: Progress }
  | { upload?: Progress; download: Progress };

type SyncStore = {
  allSyncs: AllSyncs;
  setIndivdualSync: (deviceId: string, progress?: UploadOrDownload) => void;
  resetSyncStore: () => void;
};

const emptyProgress: Progress = {
  completed: 0,
  total: 0,
};

// make upload and download optional
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
              isCompleted: state.allSyncs[deviceId].isCompleted || false,
              upload: state.allSyncs[deviceId].upload || emptyProgress,
              download: state.allSyncs[deviceId].download || emptyProgress,
            },
          },
        };
      }

      const isCompleted = (
        sync?: ActiveSync,
        download?: Progress,
        upload?: Progress
      ): boolean => {
        if (!sync) {
          return false;
        }

        if (!download || !upload) {
          return sync.isCompleted || false;
        }

        return (
          download.completed === download.total &&
          upload.completed === upload.total
        );
      };

      return {
        ...state,
        allSyncs: {
          ...state.allSyncs,
          [deviceId]: {
            isCompleted: isCompleted(
              state.allSyncs[deviceId],
              progress.download,
              progress.upload
            ),
            upload:
              progress.upload ||
              state.allSyncs[deviceId].upload ||
              emptyProgress,
            download:
              progress.download ||
              state.allSyncs[deviceId].download ||
              emptyProgress,
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
        (uploadOrDownload: UploadOrDownload) =>
          setIndivdualSync(deviceId, uploadOrDownload),
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
