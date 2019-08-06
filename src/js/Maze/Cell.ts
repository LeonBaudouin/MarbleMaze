import { Point } from '../Utils/Point';
import { Border } from './Border';
import { Direction } from '../Enum/DirectionEnum';
import { Orientation } from '../Enum/OrientationEnum';
import { Surroundings } from '../Utils/Surroundings';
import { IDrawable } from '../Interface/IDrawable';

export class Cell implements IDrawable {
    
    position : Point;
    surroundingCells : Surroundings<Cell>;
    surroundingBorders : Surroundings<Border>;

    isStart : boolean = false;
    isEnd : boolean = false;
    isOpen : boolean = false;
    isBacktracked : boolean = false;
    isRightPath : boolean = false;

    constructor(position : Point)
    {
        this.position = position;
        this.surroundingCells = new Surroundings<Cell>();
        this.surroundingBorders = new Surroundings<Border>();
    }


    public Draw(
        ctx : CanvasRenderingContext2D,
        widthUnit : number,
        heightUnit : number
    ) {
        let {x, y} = this.position;
        ctx.fillStyle = this.isStart ? 'green' : this.isEnd ? 'red' : 'transparent';
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

    public setSurroundingCells(cells : Surroundings<Cell>)
    {
        this.surroundingCells = cells;
    }

    public setSurroundingBorders(borders : Surroundings<Border>)
    {
        this.surroundingBorders = borders;
    }
}