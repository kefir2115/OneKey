const TABLE = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LENGTH = 32;

export default function generate() {
    return Array(LENGTH).fill("").map(e => TABLE[Math.round(Math.random() * (TABLE.length - 1))]).join("");
}