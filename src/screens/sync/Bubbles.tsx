import * as React from "react";
import { Dimensions, View } from "react-native";
import {
  Canvas,
  Circle,
  Shadow,
  Text as SkiaText,
  useFont,
  useTouchHandler,
} from "@shopify/react-native-skia";
import * as d3 from "d3";

import { colors, spacing } from "../../lib/styles";
import { Text, styles as textStyles } from "../../components/Text";
import { Peer } from "./Devices";

type Me = {
  id: "me";
  has: null;
  wants: null;
};

interface MeNode extends d3.SimulationNodeDatum, Me {
  radius: number;
}

interface PeerNode extends d3.SimulationNodeDatum, Peer {
  radius: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

function isTargetNode(node: Peer | Me): node is Me {
  return node.id === "me";
}

const MAX_RADIUS = 50;

const MIN_RADIUS = 20;

function createNodes(peers: Peer[]): [MeNode, ...PeerNode[]] {
  return [
    {
      id: "me",
      has: null,
      wants: null,
      index: 0,
      radius: MAX_RADIUS,
      // Fix the position of this node
      fx: (SCREEN_WIDTH - 24) / 2,
      fy: MAX_RADIUS,
    },
    ...peers.map((p) => {
      const { has, wants } = p;
      const syncedRatio = has / wants;
      const radius = Math.max(MAX_RADIUS * syncedRatio, MIN_RADIUS);
      return {
        ...p,
        radius,
      };
    }),
  ];
}

function createLinks(
  peers: Peer[]
): d3.SimulationLinkDatum<ReturnType<typeof createNodes>[number]>[] {
  return peers.map((p, i) => ({
    index: i,
    source: p.id,
    target: "me",
  }));
}

function createSimulation(peers: Peer[]) {
  const nodes = createNodes(peers);
  const links = createLinks(peers);

  const forceNode = d3.forceManyBody();

  const forceLink = d3
    .forceLink<(typeof nodes)[number], (typeof links)[number]>(links)
    .id((n) => n.id)
    .strength((l) => {
      const [, ...peerNodes] = nodes;

      const sourceNode = peerNodes.find((n) => {
        // This shouldn't happen
        if (typeof l.source === "string" || typeof l.source === "number") {
          return n.id === l.source;
        }

        if ("id" in l.source) {
          return n.id === l.source.id;
        }
      });

      const syncedRatio = sourceNode ? sourceNode.has / sourceNode.wants : 1;

      // 0 = furthest, 1 = closest
      return Math.max(syncedRatio, 0.1);
    });

  const forceCollide = d3
    .forceCollide<(typeof nodes)[number]>()
    // Add buffer to give some space
    .radius((d) => d.radius + 12)
    // Higher iterations to prevent overlap
    .iterations(10);

  return (
    d3
      .forceSimulation<(typeof nodes)[number], (typeof links)[number]>(nodes)
      .force("link", forceLink)
      .force("charge", forceNode)
      // TODO: Adjust y so that me node is at top
      .force("positionY", d3.forceY(Math.max(MAX_RADIUS * 4)).strength(0.5))
      // 24 accounts for wrapping view padding
      .force("positionX", d3.forceX((SCREEN_WIDTH - 24) / 2).strength(0.5))
      .force("collide", forceCollide)
      .stop()
  );
}

function useSimulationEffect(peers: Peer[]) {
  const [status, setStatus] = React.useState<"idle" | "done" | "loading">(
    "idle"
  );
  const [nodes, setNodes] = React.useState<(MeNode | PeerNode)[]>([]);

  React.useEffect(() => {
    const sim = createSimulation(peers);

    setStatus("loading");

    sim
      .restart()
      .on("tick", () => {
        const [meNode, ...peerNodes] = sim.nodes();

        // Adjust the x, y for peer nodes so they fall within the boundaries of the canvas
        for (const node of peerNodes) {
          if (node.y && node.x) {
            const adjustedY = Math.max(node.y, MAX_RADIUS * 3);
            const adjustedX = Math.max(
              node.radius * 2,
              Math.min(SCREEN_WIDTH - 24 - 2 * node.radius, node.x)
            );
            // TODO: Should handle a max y here too
            node.y = adjustedY;
            node.x = adjustedX;
          }
        }
        setNodes([meNode, ...peerNodes]);
      })
      .on("end", () => {
        setStatus("done");
      });

    return () => {
      sim.stop();
      setStatus("idle");
    };
  }, [peers]);

  return { nodes, status };
}

// https://stackoverflow.com/a/481150
function pointIsInCircle(
  point: { x: number; y: number },
  circle: { x: number; y: number; radius: number }
) {
  return (
    (point.x - circle.x) ** 2 + (point.y - circle.y) ** 2 <= circle.radius ** 2
  );
}

// Calculate the bounds of the placement of the text within a circle
// x, y represents the coordinate of the circle's center
function calculateTextLocationBounds({
  x,
  y,
  radius,
  fontSize,
}: {
  x: number;
  y: number;
  radius: number;
  fontSize: number;
}) {
  const xAdjustment = radius * (3 / 4);
  const yAdjustment = fontSize / 3;

  return {
    min: {
      x: x - xAdjustment,
      y: y + yAdjustment,
    },
    max: {
      x: x + xAdjustment,
      y: y - yAdjustment,
    },
  };
}

function calculateSkiaTextProps(
  text: string,
  {
    center,
    textWidth,
    ellipsisWidth,
    radius,
    fontSize,
  }: {
    center: { x: number; y: number };
    textWidth: number;
    ellipsisWidth: number;
    radius: number;
    fontSize: number;
  }
) {
  const { min, max } = calculateTextLocationBounds({
    x: center.x,
    y: center.y,
    radius,
    fontSize,
  });

  const maxWidth = max.x - min.x;

  if (textWidth <= maxWidth)
    return { text, x: center.x - textWidth / 2, y: min.y };

  const widthDiff = textWidth - (maxWidth - ellipsisWidth);

  const avgCharWidth = textWidth / text.length;

  // Using floor here provides too little right-hand space on web,
  // which is not really a concern of ours for now
  const charCountToRemove = Math.floor(widthDiff / avgCharWidth);

  return {
    text: text.slice(0, text.length - charCountToRemove) + "…",
    x: min.x,
    y: min.y,
  };
}

// TODO: Using this causes the app to crash :/
const CircleText = ({
  x,
  y,
  radius,
  text,
}: {
  x?: number;
  y?: number;
  radius: number;
  text: string;
}) => {
  const font = useFont(
    require("../../../assets/Roboto-Regular.ttf"),
    textStyles.small.fontSize
  );

  const center = React.useMemo(
    () =>
      typeof x === "number" && typeof y === "number" ? { x, y } : undefined,
    [x, y]
  );

  const textWidth = React.useMemo(
    () => (font ? font.getTextWidth(text) : undefined),
    [font, text]
  );

  const ellipsisWidth = React.useMemo(
    () => (font ? font.getTextWidth("…") : undefined),
    [font]
  );

  const skiaTextProps = React.useMemo(
    () =>
      center && textWidth && ellipsisWidth
        ? calculateSkiaTextProps(text, {
            center,
            radius,
            fontSize: textStyles.small.fontSize,
            textWidth,
            ellipsisWidth,
          })
        : undefined,
    [text, center, radius, ellipsisWidth, textWidth]
  );

  if (!font || !skiaTextProps) return null;

  return <SkiaText {...skiaTextProps} font={font} />;
};

export const Bubbles = ({ peers }: { peers: Peer[] }) => {
  const [activeNode, setActiveNode] = React.useState<PeerNode | null>(null);

  const { nodes } = useSimulationEffect(peers);

  const onTouch = useTouchHandler(
    {
      onEnd: (event) => {
        const touchedNode = nodes.find((n) => {
          if (!(typeof n.x === "number" && typeof n.y === "number"))
            return false;

          return pointIsInCircle(
            { x: event.x, y: event.y },
            { x: n.x, y: n.y, radius: n.radius }
          );
        });

        if (touchedNode && isTargetNode(touchedNode)) return;

        setActiveNode((prev) => {
          if (touchedNode) {
            if (prev) {
              return touchedNode.id === prev.id ? null : touchedNode;
            } else {
              return touchedNode;
            }
          } else {
            return null;
          }
        });
      },
    },
    [activeNode, nodes]
  );

  React.useEffect(() => {
    console.log(activeNode?.id);
  }, [activeNode]);

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        style={{
          height: 500,
          borderWidth: 1,
          borderColor: "yellow",
        }}
        onTouch={onTouch}
      >
        {nodes.map((n) => {
          const isMe = isTargetNode(n);

          // For @shopify/react-native-skia >= 0.1.159
          // the fill color will flash black for some nodes randomly
          return (
            <Circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={n.radius}
              color={
                isMe
                  ? colors.MAPEO_BLUE
                  : activeNode?.id === n.id
                  ? colors.LIGHT_BLUE
                  : colors.WHITE
              }
            >
              <Shadow dx={0} dy={0} blur={2} color={colors.DARK_GRAY} />
              {/* <CircleText
                x={n.x}
                y={n.y}
                radius={n.radius}
                text={isMe ? "Me" : n.name || n.id}
              /> */}
            </Circle>
          );
        })}
      </Canvas>
    </View>
  );
};
