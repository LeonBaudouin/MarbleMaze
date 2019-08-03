import { Cell } from './Cell';
import { Border } from './Border';
import { Point } from '../Utils/Point';
import { Orientation } from '../Enum/OrientationEnum';
import { Direction } from '../Enum/DirectionEnum';
import { Backtracker } from './Backtracker';
import { Surroundings } from '../Utils/Surroundings';
import { IDrawable } from '../Interface/IDrawable';
import { IUpdatable } from '../Interface/IUpdatable';
import { Marble } from './Marble';

export class Maze implements IDrawable, IUpdatable
{   
    cells : Cell[] = [];
    horizontalBorders : Border[] = [];
    verticalBorders : Border[] = [];
    marble : Marble = null;
    width : number;
    height : number;
    pathSize : number;

    constructor(width : number, height : number, pathSize : number)
    {
        this.height = height;
        this.width = width;
        this.pathSize = pathSize;
        this.InitGrid();
        this.BuildMaze();
    }

    private InitGrid()
    {
        this.FillCells();
        this.FillBorders();
        this.FillCellsReferences();
    }

    private FillCells()
    {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.cells.push(new Cell(new Point(i, j)));
            }
        }
    }

    private FillBorders()
    {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height + 1; j++) {
                let isWall = i == this.width || j == 0 || j == this.height;
                let border = new Border(new Point(i, j), Orientation.Horizontal, isWall);
                this.horizontalBorders.push(border);
            }
        }


        for (let i = 0; i < this.width + 1; i++) {
            for (let j = 0; j < this.height; j++) {
                let isWall = i == 0 || i == this.width || j == this.height;
                let border = new Border(new Point(i, j), Orientation.Vertical, isWall);
                this.verticalBorders.push(border);
            }
        }
    }

    private FillCellsReferences()
    {
        this.cells.forEach(cell => {
            let cells = new Surroundings<Cell>();
            cells[Direction.Up] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Up))[0];
            cells[Direction.Right] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Right))[0];
            cells[Direction.Down] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Down))[0];
            cells[Direction.Left] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Left))[0];

            let borders = new Surroundings<Border>();
            borders[Direction.Up] = this.horizontalBorders.filter(border => cell.isNextToBorder(border, Direction.Up))[0];
            borders[Direction.Right] = this.verticalBorders.filter(border => cell.isNextToBorder(border, Direction.Right))[0];
            borders[Direction.Down] = this.horizontalBorders.filter(border => cell.isNextToBorder(border, Direction.Down))[0];
            borders[Direction.Left] = this.verticalBorders.filter(border => cell.isNextToBorder(border, Direction.Left))[0];

            cell.setSurroundingCells(cells);
            cell.setSurroundingBorders(borders);
        });
    }

    private BuildMaze()
    {
        let randomIndex = Math.floor(Math.random() * this.cells.length);
        let randomCell = this.cells[randomIndex];
        randomCell.isOpen = true;
        randomCell.isStart = true;
        let backtracker = new Backtracker;
        let path = backtracker.CarveMaze(randomCell, this.pathSize);
        this.marble = new Marble(path[0], 0.5);
    }
    
    public Update(
        ctx : CanvasRenderingContext2D,
        widthUnit : number,
        heightUnit : number
    ) : void {
        this.marble.Update(ctx, widthUnit, heightUnit);
    }
    
    public Draw(
        ctx : CanvasRenderingContext2D,
        widthUnit : number,
        heightUnit : number
    ) : void {
        this.cells.forEach(cell => {
            cell.Draw(ctx, widthUnit, heightUnit);
        });

        this.horizontalBorders.forEach(border => {
            border.Draw(ctx, widthUnit, heightUnit);
        });

        this.verticalBorders.forEach(border => {
            border.Draw(ctx, widthUnit, heightUnit);
        });

        this.marble.Draw(ctx, widthUnit, heightUnit);
    }
}