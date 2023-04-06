import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SyncGroup, SyncContext } from "../contexts/SyncContext";

export function useSync(deviceId: string, syncGroup: SyncGroup) {
  const { allSyncs, setIndividualSync, incrementSync } =
    useContext(SyncContext);
  const thisSync = allSyncs[deviceId];
  const interval = useRef<NodeJS.Timer>();
  const [status, setStatus] = useState<"active" | "stopped" | "idle">(
    thisSync && thisSync.progress.completed > 0 ? "active" : "idle"
  );

  useEffect(() => {
    if (!thisSync) {
      const total = getRandomNumberMax30();
      setIndividualSync(deviceId, { total, completed: 0 }, syncGroup);
    }
  }, [thisSync]);

  if (
    thisSync &&
    thisSync.progress.completed >= thisSync.progress.total &&
    status === "active"
  ) {
    setStatus("stopped");
    clearInterval(interval.current);
  }

  useEffect(() => {
    if (status !== "active" || !thisSync) {
      clearInterval(interval.current);
      return;
    }

    interval.current = setInterval(() => {
      incrementSync(deviceId);
    }, 100);

    return () => {
      clearInterval(interval.current);
    };
  }, [status, thisSync]);

  return useMemo(
    () =>
      [
        !thisSync ? undefined : thisSync.progress,
        () => {
          setStatus("active");
        },
      ] as const,
    [thisSync, deviceId]
  );
}

/**
 *
 * @param syncGroup
 * @returns an array of all active syncs
 */
export function useActiveSync(syncGroup: SyncGroup) {
  const { allSyncs } = useContext(SyncContext);

  return Object.values(allSyncs).filter(
    (val) =>
      val.syncGroup === syncGroup &&
      val.progress.completed > 0 &&
      val.progress.completed < val.progress.total
  );
}

function getRandomNumberMax30() {
  return Math.floor(Math.random() * (30 - 1) + 1);
}
