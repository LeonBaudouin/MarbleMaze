import { Direction } from "../Enum/DirectionEnum";

export class Point {
    x : number;
    y : number;

    constructor(x : number, y : number)
    {
        this.x = x;
        this.y = y;
    }

    getDistance(otherPoint : Point) : number
    {
        const { x: otherX, y: otherY } = otherPoint;
        const { x, y } = this;
        const a = x - otherX;
        const b = y - otherY;
        
        return Math.sqrt( a*a + b*b );
    }

    getAngle(otherPoint : Point, inDegree : boolean = false) : number
    {
        const angle = Math.atan2(otherPoint.y - this.y, otherPoint.x - this.x);
        return inDegree ? angle * 180 / Math.PI : angle;
    }

    add(otherPoint : Point) : Point
    {
        const x = this.x + otherPoint.x;
        const y = this.y + otherPoint.y;
        return new Point(x, y);
    }

    substract(otherPoint : Point) : Point
    {
        const x = this.x - otherPoint.x;
        const y = this.y - otherPoint.y;
        return new Point(x, y);
    }

    clone() : Point 
    {
        return new Point(this.x, this.y);
    }

    equal(otherPoint : Point) : boolean
    {
        return this.x == otherPoint.x && this.y == otherPoint.y;
    }
}