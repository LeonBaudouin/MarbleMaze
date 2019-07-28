import { Orientation } from './OrientationEnum';
import { Point } from './Point';

export class Border {

    position : Point;
    orientation : Orientation;
    isWall : boolean;


    constructor(
        position : Point,
        orientation : Orientation,
        isWall : boolean
    ) {
        this.position = position;
        this.orientation = orientation;
        this.isWall = isWall;
    }


    public Draw(
        ctx : CanvasRenderingContext2D,
        widthUnit : number,
        heightUnit : number
    ) {
        let start = this.getStartPoint(widthUnit, heightUnit);
        let end = this.getEndPoint(widthUnit, heightUnit);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = this.isWall ? 'red' : 'black';
        ctx.stroke();
    }


    public getStartPoint(widthUnit : number, heightUnit : number) : Point
    {
        let {x, y} = this.position;
        return new Point(x * widthUnit, y * heightUnit);
    }


    public getEndPoint(widthUnit : number, heightUnit : number) : Point
    {
        let {x, y} = this.position;
        if (this.orientation == Orientation.Horizontal) {
            return new Point((x + 1) * widthUnit, y * heightUnit);
        }
        if (this.orientation == Orientation.Vertical) {
            return new Point(x * widthUnit, (y + 1) * heightUnit);
        }
    }
}