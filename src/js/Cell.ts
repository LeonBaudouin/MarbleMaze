import { Point } from './Point';
import { Border } from './Border';
import { Direction } from './DirectionEnum';
import { Orientation } from './OrientationEnum';

export class Cell {
    position : Point;
    surroundingCells : Cell[];
    surroundingBorders : Border[];
    isOpen : boolean = false;

    constructor(position : Point)
    {
        this.position = position;
        this.surroundingCells = [null, null, null, null];
        this.surroundingBorders = [null, null, null, null];
    }


    public Draw(
        ctx : CanvasRenderingContext2D,
        widthUnit : number,
        heightUnit : number
    ) {
        let {x, y} = this.position;
        ctx.fillStyle = this.isOpen ? 'grey' : 'transparent';
        ctx.fillRect(x * widthUnit, y * heightUnit, widthUnit, heightUnit);
    }


    public isNextToCell(cell : Cell, direction : Direction) : boolean
    {
        switch (direction) {
            case Direction.Up:
                return (this.position.x == cell.position.x) && (this.position.y - cell.position.y == 1);
            case Direction.Right:
                return (this.position.y == cell.position.y) && (cell.position.x - this.position.x == 1);
            case Direction.Down:
                return (this.position.x == cell.position.x) && (cell.position.y - this.position.y == 1);
            case Direction.Left:
                return (this.position.y == cell.position.y) && (this.position.x - cell.position.x == 1);
        }
    }

    public isNextToBorder(border : Border, direction : Direction) : boolean
    {
        switch (direction) {
            case Direction.Up:
                return (border.orientation == Orientation.Horizontal)
                        && (this.position.x == border.position.x)
                        && (this.position.y == border.position.y);
            case Direction.Right:
                return (border.orientation == Orientation.Vertical)
                        && (this.position.y == border.position.y)
                        && (this.position.x + 1 == border.position.x);
            case Direction.Down:
                return (border.orientation == Orientation.Horizontal)
                        && (this.position.x == border.position.x)
                        && (this.position.y + 1 == border.position.y);
            case Direction.Left:
                return (border.orientation == Orientation.Vertical)
                        && (this.position.x == border.position.x)
                        && (this.position.y == border.position.y);
        }
    }


    public getSurroundingCell(direction : Direction)
    {
        return this.surroundingCells[direction];
    }

    public setSurroundingCells(cells : Cell[])
    {
        this.surroundingCells = cells;
    }


    public getSurroundingBorder(direction : Direction)
    {
        return this.surroundingBorders[direction];
    }

    public setSurroundingBorders(borders : Border[])
    {
        this.surroundingBorders = borders;
    }
}