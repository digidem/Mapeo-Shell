import { Peer } from "../sharedTypes";

function createHasAndWants() {
  const wants = {
    observations: randomInteger(1, 100),
    media: randomInteger(1, 100),
  };
  const has = {
    observations: randomInteger(1, wants.observations),
    media: randomInteger(1, 100),
  };

  return { has, wants };
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTimestamp() {
  return randomTimestamp(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  );
}

function randomTimestamp(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).getTime();
}

export const PeerList: Peer[] = [
  {
    ...createHasAndWants(),
    id: 1,
    name: "HP Laptop 17",
    deviceId: "Hp17",
    deviceType: "desktop",
    lastSynced: createTimestamp(),
    connectionType: "local",
  },
  {
    ...createHasAndWants(),
    id: 2,
    name: "Julienne",
    deviceId: "2",
    deviceType: "mobile",
    lastSynced: createTimestamp(),
    connectionType: "local",
  },
  {
    ...createHasAndWants(),
    id: 3,
    name: "Mapeo Cloud",
    deviceId: "3",
    deviceType: "mobile",
    lastSynced: createTimestamp(),
    connectionType: "local",
  },
  {
    ...createHasAndWants(),
    id: 4,
    name: "Tom",
    deviceId: "4",
    deviceType: "mobile",
    lastSynced: createTimestamp(),
    connectionType: "local",
  },
  {
    ...createHasAndWants(),
    id: 5,
    name: "Mar",
    deviceId: "5",
    deviceType: "mobile",
    lastSynced: createTimestamp(),
    connectionType: "local",
  },
  {
    ...createHasAndWants(),
    id: 6,
    name: "Margo",
    deviceId: "6",
    deviceType: "mobile",
    lastSynced: createTimestamp(),
    connectionType: "local",
  },
  {
    ...createHasAndWants(),
    id: 7,
    name: "Ed",
    deviceId: "7",
    deviceType: "mobile",
    lastSynced: createTimestamp(),
    connectionType: "local",
  },
];
