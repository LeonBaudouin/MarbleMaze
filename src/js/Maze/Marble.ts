import { Cell } from './Cell';
import { Point } from '../Utils/Point';
import { IDrawable } from '../Interface/IDrawable';
import { IUpdatable } from '../Interface/IUpdatable';

export class Marble implements IDrawable, IUpdatable
{

    private startingCell : Cell;
    public pixelPosition : Point = null;
    public size : number;

    constructor(startingCell : Cell, size : number) {
        this.size = size;
        this.startingCell = startingCell;
    }
    
    public Update(
        ctx : CanvasRenderingContext2D, 
        widthUnit : number, 
        heightUnit : number
    ) : void {

    }

    public Draw(
        ctx : CanvasRenderingContext2D,
        widthUnit : number,
        heightUnit : number
    ) {
        if (this.pixelPosition === null) {
            let x = (this.startingCell.position.x + 0.5) * widthUnit;
            let y = (this.startingCell.position.y + 0.5) * heightUnit;
            this.pixelPosition = new Point(x, y);
        }   
        let {x, y} = this.pixelPosition;
        ctx.beginPath();
        ctx.arc(x, y, this.size * widthUnit / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }
}