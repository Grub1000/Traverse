// Make sure to credit @Jorge Ramirez aka @Grub; if you decide to use any of this code thanks! :D It Took a whole 5 hours to develop!
export function dijkstra(grid, startNode, endNode) {
    let visitedNodes = []
    startNode.distance = 0;
    let incomingNodes = extractImbeddedNodes(grid)
    while (!!incomingNodes.length) {
        let sortedNeighbors = sortNeighbors(incomingNodes)
        let currentNode = sortedNeighbors.shift()
        if (currentNode.wall) { continue }
        if (currentNode.distance === Infinity) return visitedNodes;
        currentNode.visited = true;
        visitedNodes.push(currentNode)
        if (currentNode === endNode) return visitedNodes
        updateNeighbors(grid, currentNode)
    }
}
function extractImbeddedNodes(grid) {
    let extractedNodes = []
    for (let i of grid) {
        for (let j of i) {
            extractedNodes.push(j)
        }
    }
    return extractedNodes
}
function sortNeighbors(incomingNodes) {
    return incomingNodes.sort((a, b) => a.distance - b.distance)
}
function updateNeighbors(grid, currentNode) {
    let foundUnvisitedNeighbors = findNeighbors(grid, currentNode)
    for (let i of foundUnvisitedNeighbors) {
        i.distance = currentNode.distance + 1;
        i.previousNode = currentNode;
    }
}
function findNeighbors(grid, currentNode) {
    let neighborNodes = []
    let { x, y } = currentNode
    if (grid[x][y].x > 0) { neighborNodes.push(grid[x - 1][y]) }
    if (grid[x][y].x < grid.length - 1) { neighborNodes.push(grid[x + 1][y]) }
    if (grid[x][y].y > 0) { neighborNodes.push(grid[x][y - 1]) }
    if (grid[x][y].y < grid[x].length - 1) { neighborNodes.push(grid[x][y + 1]) }
    return neighborNodes.filter(i => i.visited === false)
}
export function shortestPath(endNode) {
    let shortestPath = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath;
}