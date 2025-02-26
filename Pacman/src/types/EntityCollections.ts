import Dot from "../entities/Dot";
import Ghost from "../entities/Ghost/Ghost";
import PathPellet from "../entities/Pellets/PathPellet";
import PowerPellet from "../entities/Pellets/PowerPellet";
import Wall from "../entities/Wall";

/**
 * Entity collections for the level
 */
export interface EntityCollections {
    walls: Wall[];
    dots: Dot[];
    ghosts: Ghost[];
    pellets: (PowerPellet | PathPellet)[];
  }