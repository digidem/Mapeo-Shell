import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SyncGroup, SyncContext, SyncStatus } from "../contexts/SyncContext";

type Progress = {
  completed: number;
  total: number;
};

type ActiveSync = {
  progress: Progress;
  syncGroup: SyncGroup;
};

export function useSync(
  deviceId: string,
  syncGroup: SyncGroup,
  shouldStart: boolean
) {
  const [thisSync, setThisSync] = useState<ActiveSync>({
    progress: { total: getRandomNumberMax30(), completed: 0 },
    syncGroup,
  });
  const [status, setStatus] = useStatus(deviceId, syncGroup);

  if (shouldStart && status === "idle") {
    setStatus("active");
  }

  useEffect(() => {
    if (status !== "active") return;

    const interval = setInterval(() => {
      setThisSync((val) => {
        const incrementedCompleted = val.progress.completed + 1;
        if (incrementedCompleted >= val.progress.total) {
          clearInterval(interval);
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
      // Randomly adding a number so they don't all update at the same rate
    }, 500 + getRandomNumberMax30() * 5);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  return useMemo(
    () => thisSync.progress.completed / thisSync.progress.total || 0,
    [thisSync]
  );
}

const useStatus = (deviceId: string, syncGroup: SyncGroup) => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [allSyncs, setAllSyncs] = useContext(SyncContext);

  useEffect(() => {
    if (
      !allSyncs[syncGroup][deviceId] ||
      allSyncs[syncGroup][deviceId] !== status
    ) {
      setAllSyncs((val) => ({
        ...val,
        [syncGroup]: {
          ...val[syncGroup],
          [deviceId]: status,
        },
      }));
    }
  }, [syncGroup, deviceId, status, allSyncs]);

  return [status, setStatus] as const;
};

function getRandomNumberMax30() {
  return Math.floor(Math.random() * (30 - 1) + 1);
}
