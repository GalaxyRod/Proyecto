import Node from './Node';

/**
 * Class for pathfinding algorithms
 */
export default class PathFinder {
  /**
   * Construct a path from one node to another using BFS
   * @param {Node} from - Starting node
   * @param {Node} to - Destination node
   * @returns {Array<Node>} Path as array of nodes
   */
  static constructPathBFS(from: Node, to: Node): Node[] {
    const visited = new Set<Node>(); // keep track of the visited nodes
    const queue: Node[] = [from]; // the current node to be visited, starts off at the "from" starting point

    while (queue.length > 0) { // until there are no more nodes left
      const element = queue.pop()!; // examine the current node (we know it exists because of the check above)
      visited.add(element); // we have now visited it

      if (element === to) { // if we've reached the destination
        const path: Node[] = []; // begin path construction
        let current: Node = element;
        while (current !== from) {
          path.push(current);
          current = current.prev!; // We know prev is not null because we've built the path
        }
        path.push(from);
        path.reverse(); // change from dest - start, to start - dest
        return path; // the fully constructed path
      }

      element.neighbours.forEach(n => {
        // only care about a node if we haven't seen it
        // and it isn't a wall
        if (n.isPassable && !visited.has(n)) {
          n.prev = element;
          queue.unshift(n); // add to the queue
        }
      });
    }
    
    return []; // no path found
  }
}