import { Component, DoCheck } from '@angular/core';
import { emptyTile, numberOfNeighboursWithBomb, Tile, computeNeighbours, Coord, initGridWith, isSameCoord, DEFAULT_BOMB_PROBABILTY, initBombGridWith, OperationType, computeCountForGridPredicate, haveBombsBeenInitialised } from 'src/app/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements DoCheck {
  // Encodes all of the bombs and flags on the screen
  grid: Tile[][] = this.getGridFromLocalStorage();

  // True if state of grid has changed, otherwise false
  hasGridChanged: boolean = false;

  // The probability out of 100 of any given tile having a bomb in it
  bombProbabilityPerTile: number = DEFAULT_BOMB_PROBABILTY;

  // The old bombProbabilityPerTile for detecting whether it has changed
  oldBombProbabiltyPerTile: number = DEFAULT_BOMB_PROBABILTY;

  // True if user has either won the game or hit a bomb, otherwise false
  isGameOver: boolean = localStorage.getItem("gameOver") !== null;

  // True if modal is currently displaying on screen, otherwise false
  isModalVisible: boolean = false;

  // The operation that executes when user left clicks on a tile (or taps on a touchscreen)
  operationTypeOnLeftClick: OperationType = OperationType.Reveal;

  ngDoCheck() {
    this.handleUpdateGridLocalStorage();
    this.handleBombProbabilityChange();
  }

  getGridFromLocalStorage() {
    const gridStr = localStorage.getItem("grid");

    if (gridStr === null) {
      return initGridWith(emptyTile);
    } else {
      return <Tile[][]>JSON.parse(gridStr);
    }
  }

  // If grid has changed, update local storage
  handleUpdateGridLocalStorage() {
    if (this.hasGridChanged) {
      localStorage.setItem("grid", JSON.stringify(this.grid));

      this.hasGridChanged = false;
    }
  }

  // If bomb probability has changed, reset game
  handleBombProbabilityChange() {
    if (this.bombProbabilityPerTile !== this.oldBombProbabiltyPerTile) {
      this.oldBombProbabiltyPerTile = this.bombProbabilityPerTile;

      this.resetGame();
    }
  }

  // Event that triggers when user left clicks on a tile (or taps on a touchscreen)
  handleLeftClick(coord: Coord) {
    if (this.operationTypeOnLeftClick === OperationType.Flag) {
      this.toggleFlagAt(coord);
    } else {
      this.revealTileAt(coord);
    }
  }

  // Reveal what's under a tile
  revealTileAt({ row, col }: Coord) {
    if (!haveBombsBeenInitialised(this.grid)) {
      this.initBombGrid({ row, col });
      this.revealNeighbouringTiles({ row, col }, []);
    } else if (!this.grid[row][col].hasFlag && this.grid[row][col].hasBomb) {
      this.isGameOver = true;
      localStorage.setItem("gameOver", "");
    } else if (!this.grid[row][col].hasFlag && !this.grid[row][col].isRevealed && !this.isGameOver) {
      this.revealNeighbouringTiles({ row, col }, []);
    }
  }

  // Initialise a grid of bombs, where each tile has some probability of being a bomb
  initBombGrid(exlusion: Coord) {
    const newBombGrid = initBombGridWith(this.bombProbabilityPerTile, exlusion);

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        this.grid[row][col].hasBomb = newBombGrid[row][col];
      }
    }

    this.hasGridChanged = true;
  }

  // Recursively reveal the tiles around some coord. Will only trigger for neighbours if the coord has no bomb neighbours
  revealNeighbouringTiles(coord: Coord, visited: Coord[]) {
    const adjacentBombCount = numberOfNeighboursWithBomb(coord, this.grid);

    if (!this.grid[coord.row][coord.col].isRevealed && !visited.some(visitedCoord => isSameCoord(coord, visitedCoord))) {
      visited.push(coord);
      this.handleReplacedFlag(coord);

      if (adjacentBombCount === 0) {
        computeNeighbours(coord).forEach(neighbour => this.revealNeighbouringTiles(neighbour, visited));
      }

      this.grid[coord.row][coord.col].isRevealed = true;
      this.grid[coord.row][coord.col].bombNeighbourCount = adjacentBombCount;
      this.hasGridChanged = true;
    }
  }

  handleReplacedFlag({ row, col }: Coord) {
    if (this.grid[row][col].hasFlag) {
      this.toggleFlagAt({ row, col });
    }
  }

  handleRightClick(coord: Coord) {
    this.toggleFlagAt(coord);
  }

  toggleFlagAt({ row, col }: Coord) {
    if (!this.isGameOver && this.canToggleFlagAt({ row, col })) {
      this.grid[row][col].hasFlag = !this.grid[row][col].hasFlag;
      this.hasGridChanged = true;
    }
  }

  // Can only enter a new flag if flag count doesn't exceed bomb count and tile hasn't already been revealed
  canToggleFlagAt({ row, col }: Coord) {
    const flagCount = computeCountForGridPredicate(this.grid, ({ hasFlag }) => hasFlag);
    const bombCount = computeCountForGridPredicate(this.grid, ({ hasBomb }) => hasBomb);

    return !this.grid[row][col].isRevealed && (this.grid[row][col].hasFlag || flagCount < bombCount);
  }

  resetGame() {
    this.grid = initGridWith(emptyTile);
    this.isGameOver = false;

    localStorage.removeItem("gameOver");
  }

  resizePage() {
    localStorage.clear();
    location.reload();
  }

  showTutorial() {
    this.isModalVisible = true;
  }

  hideTutorial() {
    this.isModalVisible = false;
  }

  toggleOperationTypeOnLeftClick() {
    this.operationTypeOnLeftClick = OperationType.Flag ? OperationType.Reveal : OperationType.Flag;
  }
}
