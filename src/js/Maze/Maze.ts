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
import { Context } from '../Utils/Context';

export class Maze implements IDrawable, IUpdatable
{   
    cells : Cell[] = [];
    horizontalBorders : Border[] = [];
    verticalBorders : Border[] = [];
    marble : Marble = null;
    width : number;
    height : number;
    pathSize : number;
    context : Context;

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
        this.FillBordersReferences();
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
            cells.set(this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Up))[0], Direction.Up);
            cells.set(this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Right))[0], Direction.Right);
            cells.set(this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Down))[0], Direction.Down);
            cells.set(this.cells.filter(otherCell => cell.isNextToCell(otherCell, Direction.Left))[0], Direction.Left);

            let borders = new Surroundings<Border>();
            borders.set(this.horizontalBorders.filter(border => cell.isNextToBorder(border, Direction.Up))[0], Direction.Up);
            borders.set(this.verticalBorders.filter(border => cell.isNextToBorder(border, Direction.Right))[0], Direction.Right);
            borders.set(this.horizontalBorders.filter(border => cell.isNextToBorder(border, Direction.Down))[0], Direction.Down);
            borders.set(this.verticalBorders.filter(border => cell.isNextToBorder(border, Direction.Left))[0], Direction.Left);

            cell.setSurroundingCells(cells);
            cell.setSurroundingBorders(borders);
        });
    }

    private FillBordersReferences()
    {
        this.horizontalBorders.forEach((border, i) => {
            const surroundingBorders = new Surroundings<Border>();
            // Extrémité gauche
            const leftBorder = this.horizontalBorders.filter(otherBorder => border.isNextToBorder(otherBorder, Direction.Left))[0];
            surroundingBorders.set(leftBorder, Direction.Left);
            
            // Extrémité droite
            const rightBorder = this.horizontalBorders.filter(otherBorder => border.isNextToBorder(otherBorder, Direction.Right))[0];
            surroundingBorders.set(rightBorder, Direction.Right);

            border.surroundingBorders = surroundingBorders;
        });

        this.verticalBorders.forEach((border, i) => {
            const surroundingBorders = new Surroundings<Border>();
            // Extrémité haute
            const upBorder = this.verticalBorders.filter(otherBorder => border.isNextToBorder(otherBorder, Direction.Up))[0];
            surroundingBorders.set(upBorder, Direction.Up);
            
            // Extrémité basse
            const downBorder = this.verticalBorders.filter(otherBorder => border.isNextToBorder(otherBorder, Direction.Down))[0];
            surroundingBorders.set(downBorder, Direction.Down);

            border.surroundingBorders = surroundingBorders;
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
    
    public Update(context : Context) : void
    {
        this.marble.Update(context);
    }
    
    public Draw(context : Context) : void
    {
        this.cells.forEach(cell => {
            cell.Draw(context);
        });

        this.horizontalBorders.forEach(border => {
            border.Draw(context);
        });

        this.verticalBorders.forEach(border => {
            border.Draw(context);
        });

        this.marble.Draw(context);
    }
}