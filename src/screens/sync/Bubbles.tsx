import * as React from "react";
import { Dimensions, View } from "react-native";
import { Canvas, Circle, Paint } from "@shopify/react-native-skia";
import * as d3 from "d3";
import { colors } from "../../lib/styles";
import debounce from "lodash/debounce";

type Me = {
  id: "me";
  has: null;
  wants: null;
};

type Peer = {
  id: string;
  name: string | null;
  has: number;
  wants: number;
};

interface MeNode extends Me, d3.SimulationNodeDatum {
  radius: number;
}

interface PeerNode extends Peer, d3.SimulationNodeDatum {
  radius: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isTargetNode(node: Peer | Me): node is Me {
  return node.id === "me";
}

function createSimulation(peers: Peer[]) {
  const nodes: [MeNode, ...PeerNode[]] = [
    { id: "me", has: null, wants: null, index: 0, radius: peers.length * 2 },
    ...peers.map((p) => ({
      ...p,
      radius: Math.min(p.has, 5) * 2,
    })),
  ];

  const links: d3.SimulationLinkDatum<(typeof nodes)[number]>[] = peers.map(
    (p, i) => ({
      index: i,
      source: p.id,
      target: "me",
    })
  );

  const forceNode = d3.forceManyBody();

  const forceLink = d3
    .forceLink<(typeof nodes)[number], (typeof links)[number]>(links)
    .id((n) => n.id)
    .strength((l) => {
      const sourceNode = nodes.find((n) => {
        // This shouldn't happen
        if (typeof l.source === "string" || typeof l.source === "number") {
          return n.id === l.source;
        }

        if ("id" in l.source) {
          return n.id === l.source.id;
        }
      });

      // Update so that higher has = less force?
      return 1 / (sourceNode?.has || 1);
    });
  // .distance(data.nodes.length * 4);

  const forceCollide = d3
    .forceCollide<(typeof nodes)[number]>()
    .radius((d) => d.radius)
    .iterations(3);

  const simulation = d3
    .forceSimulation<(typeof nodes)[number], (typeof links)[number]>(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter(SCREEN_WIDTH / 2 - 24, 100))
    // .force("position", d3.forceY(0.5))
    .force("collide", forceCollide)
    .stop();

  return simulation;
}

function useSimulationEffect(peers: Peer[]) {
  const [nodes, setNodes] = React.useState<(MeNode | PeerNode)[]>([]);

  React.useEffect(() => {
    const sim = createSimulation(peers);

    sim
      .restart()
      .on("tick", () => {
        setNodes([...sim.nodes()]);
      })
      .on("end", () => {
        console.log(JSON.stringify(sim.nodes(), null, 2));
      });

    return () => {
      console.log("STOPPING SIM");
      sim.stop();
    };
  }, [peers]);

  return nodes;
}

function useSimulationRef(peers: Peer[]) {
  const [nodes, setNodes] = React.useState<(MeNode | PeerNode)[]>([]);

  const simulationRef = React.useRef(createSimulation(peers));

  React.useEffect(() => {
    if (simulationRef.current) {
      const nodes = simulationRef.current.nodes();

      simulationRef.current = simulationRef.current
        .restart()
        .on("tick", () => {
          setNodes([...nodes]);
        })
        .on("end", () => {
          console.log(nodes);
        });
    }

    // return () => {
    //   if (simulationRef.current) simulationRef.current.stop();
    // };
  }, [peers]);

  return nodes;
}

function generatePeers(size: number): Peer[] {
  return new Array(size).fill(null).map((_, index) => {
    const wants = randomInteger(1, 10);
    const has = randomInteger(0, wants);
    return {
      id: `peer-${index + 1}`,
      name: `Android Device ${index + 1}`,
      has,
      wants,
    };
  });
}

export const Bubbles = () => {
  const [peers, setPeers] = React.useState<Peer[]>(generatePeers(10));

  const nodes = useSimulationRef(peers);
  //   const nodes = useSimulationEffect(peers);

  return (
    <View style={{ borderWidth: 1, borderColor: "yellow" }}>
      <Canvas
        onTouch={() => setPeers(generatePeers(10))}
        style={{
          width: SCREEN_WIDTH,
          height: 400,
        }}
      >
        {nodes.map((n) => (
          <Circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.radius}
            color={isTargetNode(n) ? colors.MAPEO_BLUE : colors.WHITE}
          >
            <Paint key={n.id} color="black" style="stroke" strokeWidth={1} />
          </Circle>
        ))}
      </Canvas>
    </View>
  );
};
