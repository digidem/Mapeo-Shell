import { Peer } from "../sharedTypes";

function randomTimestamp(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).getTime();
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateData(size: number): Peer[] {
  return Array(size)
    .fill(null)
    .map((_, index) => {
      const wants = randomInteger(1, 100);
      const has = randomInteger(0, wants);
      const lastSynced = randomTimestamp(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        new Date()
      );
      const deviceType = Math.random() > 0.6 ? "desktop" : "mobile";

      return {
        id: index,
        name: `Peer ${index + 1}`,
        deviceType,
        deviceId:
          deviceType === "desktop"
            ? `Desktop ${index + 1}`
            : `Mobile ${index + 1}`,
        has,
        wants,
        lastSynced,
        connectionType: "local",
      };
    });
}
