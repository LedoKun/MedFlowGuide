// utils/UseLayout.js
import dagre from '@dagrejs/dagre';
import { Position } from '@vue-flow/core';

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout(findNode) {
    /**
     * Computes the layout for nodes and edges using dagre.
     * @param {Array} nodes - Array of nodes in the graph.
     * @param {Array} edges - Array of edges connecting the nodes.
     * @param {string} direction - Layout direction ('TB' for top-bottom or 'LR' for left-right).
     * @returns {Array} nodes - Array of nodes with updated positions based on layout.
     */
    function layout(nodes, edges, direction = 'TB') {
        if (!nodes || nodes.length === 0) {
            console.warn('No nodes available for layout.');
            return [];
        }

        // Initialize a new dagre graph for calculating layout
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({})); // Default edge label for dagre graph

        // Configure layout direction and spacing based on input direction
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({
            rankdir: direction, // Layout direction ('TB' or 'LR')
            nodesep: 80,        // Node separation (horizontal)
            ranksep: 80,        // Rank separation (vertical)
            marginx: 20,        // Horizontal margin around layout
            marginy: 20,        // Vertical margin around layout
        });

        // Loop through each node and add it to the dagre graph with dimensions
        for (const node of nodes) {
            const graphNode = findNode(node.id);

            // Set node dimensions (default to 150x50 if not specified)
            const width = graphNode?.dimensions?.width || 150;
            const height = graphNode?.dimensions?.height || 50;

            dagreGraph.setNode(node.id, { width, height });
        }

        // Add each edge to the dagre graph using source and target node IDs
        for (const edge of edges) {
            dagreGraph.setEdge(edge.source, edge.target);
        }

        // Run dagre layout algorithm to calculate positions
        dagre.layout(dagreGraph);

        // Update each node's position based on dagre's calculated output
        return nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            if (nodeWithPosition) {
                node.position = {
                    x: nodeWithPosition.x - nodeWithPosition.width / 2,
                    y: nodeWithPosition.y - nodeWithPosition.height / 2,
                };
            }
            // Set handle positions based on layout direction
            node.sourcePosition = isHorizontal ? Position.Left : Position.Top;
            node.targetPosition = isHorizontal ? Position.Right : Position.Bottom;

            return node;
        });
    }

    // Return layout function as part of composable
    return { layout };
}
