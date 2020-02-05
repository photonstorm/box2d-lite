export default function Clamp (a: number, low: number, high: number): number
{
    return Math.max(low, Math.min(a, high));
}
