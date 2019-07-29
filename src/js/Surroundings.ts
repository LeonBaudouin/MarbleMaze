import { Direction } from './DirectionEnum';
import { Cell } from './Cell';

export class Surroundings<T> {
    [Direction.Up] : T = null;
    [Direction.Right] : T = null;
    [Direction.Down] : T = null;
    [Direction.Left] : T = null;

    public forEach(callback : (element : T, direction : Direction) => void) {
        callback(this[Direction.Up], Direction.Up);
        callback(this[Direction.Right], Direction.Right);
        callback(this[Direction.Down], Direction.Down);
        callback(this[Direction.Left], Direction.Left);
    }

    public get(direction : Direction) {
        return this[direction];
    }

    public set(element : T, direction : Direction) {
        this[direction] = element;
    }
}