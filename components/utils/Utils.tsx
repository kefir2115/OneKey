export function distance(distance: number) {
    const n = parseFloat(distance.toFixed(1));
    return n < 1000 ? parseFloat(n.toFixed(1)) + 'm' : (n / 1000).toFixed(1) + 'km';
}
