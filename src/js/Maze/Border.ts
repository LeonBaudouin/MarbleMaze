import { Orientation } from '../Enum/OrientationEnum';
import { Point } from '../Utils/Point';
import { IDrawable } from '../Interface/IDrawable';
import { Surroundings } from '../Utils/Surroundings';
import { Context } from '../Utils/Context';
import { Direction } from '../Enum/DirectionEnum';

export class Border implements IDrawable
{

    position : Point;
    orientation : Orientation;
    isWall : boolean;
    isActive : boolean = true;
    surroundingBorders : Surroundings<Border>;

    constructor(
        position : Point,
        orientation : Orientation,
        isWall : boolean
    ) {
        this.position = position;
        this.orientation = orientation;
        this.isWall = isWall;
    }


    public Draw(context : Context) {
        if (!this.isActive) {
            return;
        }

        const {ctx} = context.getContextDTO();
        const start = this.getStartPoint(context);
        const end = this.getEndPoint(context);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineWidth = this.isWall ? 4 : 2;
        ctx.strokeStyle = '#6D481B';
        ctx.stroke();
    }


    public getStartPoint(context : Context = null) : Point
    {
        if (context == null) {
            context = Context.getInstance();
        }
        const {widthUnit, heightUnit} = context.getContextDTO();
        const {x, y} = this.position;
        return new Point(x * widthUnit, y * heightUnit);
    }


    public getEndPoint(context : Context = null) : Point
    {
        if (context == null) {
            context = Context.getInstance();
        }
        const {widthUnit, heightUnit} = context.getContextDTO();
        const {x, y} = this.position;
        if (this.orientation == Orientation.Horizontal) {
            return new Point((x + 1) * widthUnit, y * heightUnit);
        }
        if (this.orientation == Orientation.Vertical) {
            return new Point(x * widthUnit, (y + 1) * heightUnit);
        }
    }

    public isNextToBorder(border : Border, direction : Direction) : boolean
    {
        if(this.orientation != border.orientation) {
            false;
        }
        switch (direction) {
            case Direction.Up:
                return (this.position.x == border.position.x)
                    && (this.position.y - 1 == border.position.y);
            case Direction.Right:
                return (this.position.y == border.position.y)
                    && (this.position.x + 1 == border.position.x);
            case Direction.Down:
                return (this.position.x == border.position.x)
                    && (this.position.y + 1 == border.position.y);
            case Direction.Left:
                return (this.position.x - 1  == border.position.x)
                    && (this.position.y == border.position.y);
        }
    }
}