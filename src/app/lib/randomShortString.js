export default function randomShortString() {
    return Math.random().toString(36).substring(2, 7);
}