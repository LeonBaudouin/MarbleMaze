import { Cell } from './Cell';
import { Direction } from './DirectionEnum';

export class Backtracker {

    mainPathLength : number;
    currentPath : Cell[] = [];
    mostFittingPath : Cell[] = [];
    
    constructor(startingCell : Cell, mainPathLength : number)
    {
        this.mainPathLength = mainPathLength;
        this.NextCell(startingCell, false);
    }

    public NextCell(currentCell : Cell, hasBacktracked : boolean) : void
    {
        let { surroundingCells, surroundingBorders } = currentCell;

        let availableDirections = this.getAvailableDirections(currentCell);

        if (availableDirections.length === 0) {
            
            if (!hasBacktracked) {
                let mostFittingLengthDiff = Math.abs(this.mainPathLength - this.mostFittingPath.length);
                let currentLengthDiff = Math.abs(this.mainPathLength - this.currentPath.length);
                if (currentLengthDiff < mostFittingLengthDiff) {
                    this.mostFittingPath = [...this.currentPath];
                }
            }

            if (currentCell.isStart) {
                this.mostFittingPath[this.mostFittingPath.length - 1].isEnd = true;
                this.mostFittingPath.forEach(element => {
                    element.isRightPath = true;
                });
                return;
            }

            currentCell.isBacktracked = true;
            let backtrackCell = this.getBacktrackCell(currentCell);
            
            if (backtrackCell === null) {
                this.mostFittingPath[this.mostFittingPath.length - 1].isEnd = true;
                return;
            }

            this.currentPath.pop();

            return this.NextCell(backtrackCell, true);
        }
        
        let randomIndex = Math.floor(Math.random() * availableDirections.length);
        let randomDirection = availableDirections[randomIndex];

        surroundingBorders.get(randomDirection).isActive = false;

        let newCell = surroundingCells.get(randomDirection);
        newCell.isOpen = true;

        this.currentPath.push(newCell);

        return this.NextCell(newCell, false);
    }

    public getAvailableDirections(cell : Cell) : Direction[]
    {
        let availableDirections : Direction[] = [];

        cell.surroundingCells.forEach(
            (currentCell, direction) => {
                if(currentCell != null && !currentCell.isOpen) {
                    availableDirections.push(direction);
                }
            }
        )

        return availableDirections;
    }

    public getBacktrackCell(cell : Cell) : Cell
    {
        let nextCell = null;
        cell.surroundingBorders.forEach(
            (border, direction) => {
                if (!border.isActive) {
                    let currentCell = cell.surroundingCells.get(direction);
                    if (currentCell != null && currentCell.isOpen && !currentCell.isBacktracked) {
                        nextCell = currentCell;
                    }
                }
            }
        )
        return nextCell;
    }
}