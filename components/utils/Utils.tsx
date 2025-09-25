export function distance(distance: number) {
    const n = parseFloat(distance.toFixed(1));
    return n < 1000 ? parseFloat(n.toFixed(1)) + 'm' : (n / 1000).toFixed(1) + 'km';
}
export function adjustColor(color: string, amount: number): string {
    let col = color.replace(/^#/, '');

    if (col.length === 3) {
        col = col
            .split('')
            .map((c) => c + c)
            .join('');
    }

    const clamp = (val: number) => Math.min(255, Math.max(0, val));

    const num = parseInt(col, 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00ff) + amount);
    const b = clamp((num & 0x0000ff) + amount);

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
