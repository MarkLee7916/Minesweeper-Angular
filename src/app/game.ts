import { deepCopy, randomProbabilty } from "./utils";

export type Coord = { row: number, col: number }

export type Tile = {
    hasBomb: boolean
    hasFlag: boolean
    isRevealed: boolean
    bombNeighbourCount: number
}

export const enum OperationType {
    Reveal,
    Flag
}

export const emptyTile = {
    hasBomb: false,
    hasFlag: false,
    isRevealed: false,
    bombNeighbourCount: 0
}

// The default probability out of 100 of any given tile having a bomb in it
export const DEFAULT_BOMB_PROBABILTY = 15;

const HEIGHT = computeDimensionRatios(50, window.innerHeight);

const WIDTH = computeDimensionRatios(50, window.innerWidth);

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
export function computeCountForGridPredicate<T>(grid: readonly T[][], predicate: (item: T) => boolean) {
    return grid.reduce(
        (gridTotal, row) => gridTotal + row.reduce(
            (rowTotal, tile) => rowTotal + (predicate(tile) ? 1 : 0)
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

export function haveBombsBeenInitialised(grid: Tile[][]) {
    return grid.some(row => row.some(({ isRevealed }) => isRevealed));
}

function isOnGrid(row: number, col: number) {
    return row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH;
}

// Calculate height and width based off of the size of the users screen
function computeDimensionRatios(totalSize: number, screenDimension: number) {
    const totalScreenLength = window.innerHeight + window.innerWidth;

    return Math.round(screenDimension / totalScreenLength * totalSize);
}