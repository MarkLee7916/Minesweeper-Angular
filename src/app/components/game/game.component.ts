import { Component, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { emptyTile, numberOfNeighboursWithBomb, Tile, computeNeighbours, Coord, initialseGridWith, isSameCoord, positions, DEFAULT_BOMB_PROBABILTY } from 'src/app/grid';
import { randomProbabilty } from 'src/app/utils';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements DoCheck {
  grid: Tile[][] = initialseGridWith(() => emptyTile);
  bombProbabilityPerTile: number = DEFAULT_BOMB_PROBABILTY;
  haveBombsBeenInitialsed: boolean = false;
  isGameOver: boolean = false;
  isModalVisible: boolean = false;

  oldBombProbabiltyPerTile: number = DEFAULT_BOMB_PROBABILTY;

  ngDoCheck() {
    if (this.bombProbabilityPerTile !== this.oldBombProbabiltyPerTile) {
      this.oldBombProbabiltyPerTile = this.bombProbabilityPerTile;

      this.resetGame();
    }
  }

  handleLeftClick({ row, col }: Coord) {
    if (!this.haveBombsBeenInitialsed) {
      this.initBombGrid();
      this.revealNeighbouringTiles({ row, col }, []);
    } else if (!this.grid[row][col].hasFlag && this.grid[row][col].hasBomb) {
      this.isGameOver = true;
    } else if (!this.grid[row][col].hasFlag && !this.grid[row][col].isRevealed && !this.isGameOver) {
      this.revealNeighbouringTiles({ row, col }, []);
    }
  }

  // Initialise a grid of bombs, where each tile has some probability of being a bomb
  initBombGrid() {
    const newBombGrid = initialseGridWith(() => randomProbabilty(this.bombProbabilityPerTile));

    positions.forEach(({ row, col }) => this.grid[row][col].hasBomb = newBombGrid[row][col]);
    this.haveBombsBeenInitialsed = true;
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
    }
  }

  handleReplacedFlag({ row, col }: Coord) {
    if (this.grid[row][col].hasFlag) {
      this.grid[row][col].hasFlag = false;
    }
  }

  handleRightClick({ row, col }: Coord) {
    if (!this.isGameOver && !this.grid[row][col].isRevealed)
      this.grid[row][col].hasFlag = !this.grid[row][col].hasFlag;
  }

  resetGame() {
    this.grid = initialseGridWith(() => emptyTile);
    this.haveBombsBeenInitialsed = false;
    this.isGameOver = false;
  }

  resizePage() {
    location.reload();
  }

  showTutorial() {
    this.isModalVisible = true;
  }

  hideTutorial() {
    this.isModalVisible = false;
  }
}
