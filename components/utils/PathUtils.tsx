export default class Path {
    base = '';

    constructor(width: number, height: number) {
        this.base = `M0 0 H${width} V${height} H0 Z`;
    }

    getRect(x: number, y: number, w: number, h: number) {
        return this.getRoundRect(x, y, w, h, 0);
    }
    getRoundRect(x: number, y: number, w: number, h: number, r: number) {
        r = Math.min(r, w / 2, h / 2);

        return `${this.base}
            M${x + r},${y} 
            H${x + w - r} 
            A${r},${r} 0 0 1 ${x + w},${y + r} 
            V${y + h - r} 
            A${r},${r} 0 0 1 ${x + w - r},${y + h} 
            H${x + r} 
            A${r},${r} 0 0 1 ${x},${y + h - r} 
            V${y + r} 
            A${r},${r} 0 0 1 ${x + r},${y} 
            Z
        `
            .replace(/\s+/g, ' ')
            .trim();
    }
    getCircle(cx: number, cy: number, r: number) {
        return `${this.base}
            M${cx - r},${cy} 
            A${r},${r} 0 1 0 ${cx + r},${cy} 
            A${r},${r} 0 1 0 ${cx - r},${cy} 
            Z
        `
            .replace(/\s+/g, ' ')
            .trim();
    }
}
