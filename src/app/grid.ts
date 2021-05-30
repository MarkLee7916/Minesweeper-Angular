import { deepCopy, randomProbabilty } from "./utils";

export type Coord = { row: number, col: number }

export type Tile = {
    hasBomb: boolean
    hasFlag: boolean
    isRevealed: boolean
    bombNeighbourCount: number
}

export const emptyTile = {
    hasBomb: false,
    hasFlag: false,
    isRevealed: false,
    bombNeighbourCount: 0
}

export const DEFAULT_BOMB_PROBABILTY = 15;

export const HEIGHT = computeDimensionRatios(50, window.innerHeight);

export const WIDTH = computeDimensionRatios(50, window.innerWidth);

export const positions = generatePossiblePositions();

// Initialise a grid of dimensions HEIGHT x WIDTH with some value
export function initGridWith<T>(input: T): T[][] {
    const grid: T[][] = [];

    for (let row = 0; row < HEIGHT; row++) {
        grid.push([]);
        for (let col = 0; col < WIDTH; col++) {
            grid[row].push(deepCopy(input));
        }
    }

    return grid;
}

// Initialise a grid of bombs, where each tile has some probability of being a bomb
export function initBombGridWith(probability: number, exclusion: Coord) {
    const grid: boolean[][] = [];

    for (let row = 0; row < HEIGHT; row++) {
        grid.push([]);
        for (let col = 0; col < WIDTH; col++) {
            if (row === exclusion.row && col === exclusion.col) {
                grid[row].push(false);
            } else {
                grid[row].push(randomProbabilty(probability));
            }
        }
    }

    return grid;
}

// Return all adjacent positions including positions that are diagonally adjacent
export function computeNeighbours({ row, col }: Coord) {
    const neighbours = [];

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if ((i !== 0 || j !== 0) && isOnGrid(row + i, col + j)) {
                neighbours.push({ row: row + i, col: col + j });
            }
        }
    }

    return neighbours;
}

// Return the number of appearances of some value in a grid
export function computeCountForGridItem<T>(grid: readonly T[][], item: T) {
    return grid.reduce(
        (gridTotal, row) => gridTotal + row.reduce(
            (rowTotal, tile) => rowTotal + (tile === item ? 1 : 0)
            , 0)
        , 0);
}

export function numberOfNeighboursWithBomb(coord: Coord, grid: Tile[][]) {
    return computeNeighbours(coord).reduce((total: number, { row, col }: Coord) =>
        total + (grid[row][col].hasBomb ? 1 : 0)
        , 0);
}

export function isSameCoord(coord1: Coord, coord2: Coord) {
    return coord1.row === coord2.row && coord1.col === coord2.col;
}

function generatePossiblePositions() {
    const positions: Coord[] = [];

    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            positions.push({ row, col });
        }
    }

    return positions;
}

function isOnGrid(row: number, col: number) {
    return row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH;
}

// Calculate height and width based off of the size of the users screen
function computeDimensionRatios(totalSize: number, screenDimension: number) {
    const totalScreenLength = window.innerHeight + window.innerWidth;

    return Math.round(screenDimension / totalScreenLength * totalSize);
}