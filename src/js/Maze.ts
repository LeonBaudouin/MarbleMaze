import { Cell } from './Cell';
import { Border } from './Border';
import { Point } from './Point';
import { Orientation } from './OrientationEnum';
import { Direction } from './DirectionEnum';
import { Backtracker } from './Backtracker';

export class Maze {

    cells : Cell[] = [];
    horizontalBorders : Border[] = [];
    verticalBorders : Border[] = [];
    width : number;
    height : number;

    constructor(width : number, height : number)
    {
        this.height = height;
        this.width = width;
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
            let cells = new Array<Cell>(4);
            cells[Direction.Up] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Up))[0];
            cells[Direction.Right] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Right))[0];
            cells[Direction.Down] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Down))[0];
            cells[Direction.Left] = this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Left))[0];

            let borders = new Array<Border>(4);
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
        new Backtracker(randomCell);
        randomCell.isOpen = true;
    }

    public Draw(ctx : CanvasRenderingContext2D)
    {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        const widthUnit = canvasWidth / this.width;
        const heightUnit = canvasHeight / this.height;

        this.cells.forEach(cell => {
            cell.Draw(ctx, widthUnit, heightUnit);
        });

        this.horizontalBorders.forEach(border => {
            border.Draw(ctx, widthUnit, heightUnit);
        });

        this.verticalBorders.forEach(border => {
            border.Draw(ctx, widthUnit, heightUnit);
        });
    }
}