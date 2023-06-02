
export function generateRandom(min: number, max: number) {
    return Math.floor(Math.round(Math.random() * (min - max) + max))
}

