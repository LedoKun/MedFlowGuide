// utils/UseLayout.js
import dagre from '@dagrejs/dagre';
import { Position } from '@vue-flow/core';

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout(findNode) {
    function layout(nodes, edges, direction = 'TB') {
        if (!nodes || nodes.length === 0) {
            console.warn('No nodes available for layout.');
            return [];
        }

        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({
            rankdir: direction,
            nodesep: 80, // Adjust as needed
            ranksep: 80, // Adjust as needed
            marginx: 60,
            marginy: 40,
        });

        for (const node of nodes) {
            const graphNode = findNode(node.id);

            // Ensure dimensions are available
            const width = graphNode?.dimensions?.width || 150;
            const height = graphNode?.dimensions?.height || 50;

            dagreGraph.setNode(node.id, { width, height });
        }

        for (const edge of edges) {
            dagreGraph.setEdge(edge.source, edge.target);
        }

        dagre.layout(dagreGraph);

        // Set nodes with updated positions based on dagre's output
        return nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            if (!nodeWithPosition) return node; // Skip nodes that were not processed

            return {
                ...node,
                targetPosition: isHorizontal ? Position.Left : Position.Top,
                sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
                position: {
                    x: nodeWithPosition.x - nodeWithPosition.width / 2,
                    y: nodeWithPosition.y - nodeWithPosition.height / 2,
                },
            };
        });
    }

    return { layout };
}
