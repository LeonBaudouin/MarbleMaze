import { Orientation } from '../Enum/OrientationEnum';
import { Point } from '../Utils/Point';
import { IDrawable } from '../Interface/IDrawable';

export class Border implements IDrawable
{

    position : Point;
    orientation : Orientation;
    isWall : boolean;
    isActive : boolean;

    constructor(
        position : Point,
        orientation : Orientation,
        isWall : boolean
    ) {
        this.position = position;
        this.orientation = orientation;
        this.isWall = isWall;
        this.isActive = true;
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
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.isWall ? 'red' : this.isActive ? 'black' : 'transparent';
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