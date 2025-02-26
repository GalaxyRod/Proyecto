import Node from '../pathfinding/Node';
import Wall from '../entities/Wall';
import Dot from '../entities/Dot';
import Ghost from '../entities/Ghost/Ghost';
import PowerPellet from '../entities/Pellets/PowerPellet';
import PathPellet from '../entities/Pellets/PathPellet';

/**
 * Configuration for creating a Level
 */
export interface LevelConfig {
  levelData: string;
  graph: Map<string, Node>;
  startNode: Node | null;
  tileSize: number;
  walls: Wall[];
  dots: Dot[];
  ghosts: Ghost[];
  pellets: (PowerPellet | PathPellet)[];
}