import { Cell } from './Cell';
import { Point } from '../Utils/Point';
import { IDrawable } from '../Interface/IDrawable';
import { IUpdatable } from '../Interface/IUpdatable';
import { OrientationListener } from '../Event/OrientationListener';
import { Border } from './Border';
import { Orientation } from '../Enum/OrientationEnum';

export class Marble implements IDrawable, IUpdatable
{

    private listener : OrientationListener;
    private startingCell : Cell;
    private currentCells : Cell[];
    private acceleration : Point = null;
    private velocity : Point = null;
    public pixelPosition : Point = null;
    public size : number;

    constructor(startingCell : Cell, size : number) {
        this.size = size;
        this.startingCell = startingCell;
        this.currentCells = [startingCell];
        this.acceleration = new Point(0, 0);
        this.velocity = new Point(0, 0);
        this.listener = OrientationListener.getInstance();
    }
    
    public Update(
        ctx : CanvasRenderingContext2D,
        widthUnit : number, 
        heightUnit : number
    ) : void {

        if (this.pixelPosition === null) {
            const x = (this.startingCell.position.x + 0.5) * widthUnit;
            const y = (this.startingCell.position.y + 0.5) * heightUnit;
            this.pixelPosition = new Point(x, y);
        }

        this.ProcessInput();
        this.UpdateVelocity();
        this.UpdatePosition();
        this.Collision(widthUnit, heightUnit);
    }

    private UpdateVelocity() : void
    {
        this.velocity = this.velocity.add(this.acceleration)
    }

    private UpdatePosition() : void
    {    
        this.pixelPosition = this.pixelPosition.add(this.velocity);
    }

    private Collision(widthUnit : number, heightUnit : number) : void
    {
        this.currentCells.forEach( cell => {
            cell.surroundingBorders.forEach( border => {
                this.CollisionBorder(border, widthUnit, heightUnit);
            });
        });
    }

    private CollisionBorder(border : Border, widthUnit : number, heightUnit : number) : void
    {
        const nearestPoint = this.getNearestPoint(border, widthUnit, heightUnit);
        
        let smallestUnit = widthUnit > heightUnit ? heightUnit : widthUnit;

        if (this.pixelPosition.getDistance(nearestPoint) < this.size * smallestUnit / 2) {
            this.setVectorsFromCollision(border, nearestPoint, widthUnit, heightUnit);
        }
    }
    
    private setVectorsFromCollision(
        border : Border, 
        collisionPoint : Point, 
        widthUnit : number, 
        heightUnit : number
    ) : void {
        
        const { x: vx, y: vy } = this.velocity;
        const { x: ax, y: ay } = this.acceleration;

        if (
            collisionPoint.equal(border.getStartPoint(widthUnit, heightUnit))
         || collisionPoint.equal(border.getEndPoint(widthUnit, heightUnit))   
        ) {
            this.pixelPosition = this.pixelPosition.substract(this.velocity);
            this.velocity = new Point(- vy * 0.5, - vx * 0.5); 
            this.acceleration = new Point(- ay * 0.5, - ax * 0.5); 
            return;
        }

        if (border.orientation == Orientation.Horizontal)
        {
            this.pixelPosition = this.pixelPosition.substract(this.velocity);
            this.velocity = new Point(- vy * 0.5, vx * 0.5);
            this.acceleration = new Point(- ay * 0.5, ax * 0.5);
            return;
        }

        if (border.orientation == Orientation.Vertical)
        {
            this.pixelPosition = this.pixelPosition.substract(this.velocity);
            this.velocity = new Point(vy * 0.5, - vx * 0.5);
            this.acceleration = new Point(ay * 0.5, - ax * 0.5);
            return;
        }
    }

    private getNearestPoint(border : Border, widthUnit : number, heightUnit : number) : Point
    {
        const startPoint = border.getStartPoint(widthUnit, heightUnit);
        const endPoint = border.getEndPoint(widthUnit, heightUnit);
    
        // calc delta distance: source point to line start
        const delta = this.pixelPosition.substract(startPoint);
        
        // calc delta distance: line start to end
        const line = endPoint.substract(startPoint);

        // Calc position on line normalized between 0.00 & 1.00
        // == dot product divided by delta line distances squared
        const t = (delta.x * line.x + delta.y * line.y) / (line.x * line.x + line.y * line.y);

        // calc nearest pt on line
        const x = startPoint.x + line.x * t;
        const y = startPoint.y + line.y * t;

        // clamp results to being on the segment
        if ( t < 0 ) {
            return startPoint.clone();
        }
        if ( t > 1 ) {
            return endPoint.clone();
        }

        return(new Point(x, y));
    }

    private ProcessInput() : void
    {
        let { beta, gamma } = this.listener.getValue();
        
        const pitch = Math.PI * beta / 180;
        const roll = Math.PI * gamma / 180;

        const x = Math.cos(pitch) * Math.sin(roll) * 0.2;
        const y = Math.sin(pitch) * 0.2;

        this.acceleration = new Point(x, y);
    }

    public Draw(
        ctx : CanvasRenderingContext2D,
        widthUnit : number,
        heightUnit : number
    ) {
        let {x, y} = this.pixelPosition;
        let smallestUnit = widthUnit > heightUnit ? heightUnit : widthUnit;
        ctx.beginPath();
        ctx.arc(x, y, this.size * smallestUnit / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }
}