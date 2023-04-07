import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SyncGroup, SyncContext, SyncStatus } from "../contexts/SyncContext";

type Progress = {
  completed: number;
  total: number;
};

type ActiveSync = {
  progress: Progress;
  syncGroup: SyncGroup;
};

export function useSync(deviceId: string, syncGroup: SyncGroup) {
  const [thisSync, setThisSync] = useState<ActiveSync>({
    progress: { total: getRandomNumberMax30(), completed: 0 },
    syncGroup,
  });
  const interval = useRef<NodeJS.Timer>();
  const [status, setStatus] = useStatus(deviceId, syncGroup);

  useEffect(() => {
    if (status !== "active") return;

    interval.current = setInterval(() => {
      setThisSync((val) => {
        const incrementedCompleted = val.progress.completed + 1;
        if (incrementedCompleted >= val.progress.total) {
          clearInterval(interval.current);
          setStatus("stopped");
        }
        return {
          ...val,
          progress: {
            ...val.progress,
            completed: incrementedCompleted,
          },
        };
      });
    }, 100);

    return () => {
      clearInterval(interval.current);
    };
  }, [status, thisSync]);

  return useMemo(
    () =>
      [
        thisSync.progress.completed / thisSync.progress.completed || 0,
        () => {
          setStatus("active");
        },
      ] as const,
    [thisSync, deviceId, status]
  );
}

const useStatus = (deviceId: string, syncGroup: SyncGroup) => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [allSyncs, setAllSyncs] = useContext(SyncContext);

  useEffect(() => {
    if (!allSyncs[syncGroup][deviceId]) {
      setAllSyncs((val) => ({
        ...val,
        [syncGroup]: {
          ...val[syncGroup],
          [deviceId]: status,
        },
      }));
    }
  }, [syncGroup, deviceId, status, allSyncs]);

  const updateAllSyncsOnStatusUpdate = useCallback(
    (syncStatus: SyncStatus) => {
      setStatus(syncStatus);
      setAllSyncs((val) => {
        if (val[syncGroup][deviceId] && val[syncGroup][deviceId] === status) {
          return val;
        }
        return {
          ...val,
          [syncGroup]: {
            ...val[syncGroup],
            [deviceId]: syncStatus,
          },
        };
      });
    },
    [deviceId, syncGroup]
  );

  return [status, updateAllSyncsOnStatusUpdate] as const;
};

function getRandomNumberMax30() {
  return Math.floor(Math.random() * (30 - 1) + 1);
}
