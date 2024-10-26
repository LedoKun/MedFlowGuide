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
    
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        const isHorizontal = direction === 'LR';
    
        // Configure the dagre layout
        dagreGraph.setGraph({
            rankdir: direction,
            nodesep: 80,
            ranksep: 80,
            marginx: 20,
            marginy: 20,
        });
    
        // Add nodes and edges to the dagre graph
        for (const node of nodes) {
            const graphNode = findNode(node.id);
            const width = graphNode?.dimensions?.width || 150;
            const height = graphNode?.dimensions?.height || 50;
            dagreGraph.setNode(node.id, { width, height });
        }
        for (const edge of edges) {
            dagreGraph.setEdge(edge.source, edge.target);
        }
    
        // Run dagre layout calculation
        dagre.layout(dagreGraph);
    
        // Step 1: Group nodes by their rank using dagre's assigned rank
        const ranks = {};
        nodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            if (nodeWithPosition) {
                // Set initial positions from dagre
                node.position = {
                    x: nodeWithPosition.x - nodeWithPosition.width / 2,
                    y: nodeWithPosition.y - nodeWithPosition.height / 2,
                };
    
                // Group by rank
                const rank = nodeWithPosition.rank; // This rank is assigned by dagre
                if (!ranks[rank]) ranks[rank] = [];
                ranks[rank].push({ ...node, ...nodeWithPosition });
            }
        });
    
        // Step 2: Adjust y-positions within each rank to align node bottoms
        Object.values(ranks).forEach((rankNodes) => {
            // Calculate the maximum bottom Y position within the rank
            const maxBottomY = Math.max(
                ...rankNodes.map(node => node.position.y + node.height)
            );
    
            // Align each node's bottom to maxBottomY within its rank
            rankNodes.forEach((node) => {
                node.position.y = maxBottomY - node.height;
            });
        });
    
        // Step 3: Set source and target positions and return adjusted nodes
        return nodes.map((node) => {
            node.sourcePosition = isHorizontal ? Position.Left : Position.Top;
            node.targetPosition = isHorizontal ? Position.Right : Position.Bottom;
            return node;
        });
    }
    
    // Return layout function as part of composable
    return { layout };
}
