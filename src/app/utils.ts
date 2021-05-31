export const isTouchscreen = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

export function deepCopy<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
}

export function randomProbabilty(probability: number) {
    return Math.random() < (probability / 100);
}