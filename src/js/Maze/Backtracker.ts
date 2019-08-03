import { Cell } from './Cell';
import { Direction } from '../Enum/DirectionEnum';

export class Backtracker {

    private mainPathLength : number;
    private currentPath : Cell[] = [];
    private mostFittingPath : Cell[] = [];

    public CarveMaze(startingCell : Cell, mainPathLength : number) : Cell[]
    {
        this.mainPathLength = mainPathLength;
        this.currentPath = [startingCell];
        return this.NextCell(startingCell, false);
    }

    private NextCell(currentCell : Cell, hasBacktracked : boolean) : Cell[]
    {
        let { surroundingCells, surroundingBorders } = currentCell;

        let availableDirections = this.getAvailableDirections(currentCell);

        if (availableDirections.length === 0) {
            
            if (!hasBacktracked) {
                let mostFittingLengthDiff = Math.abs(this.mainPathLength - this.mostFittingPath.length);
                let currentLengthDiff = Math.abs(this.mainPathLength - this.currentPath.length);
                if (currentLengthDiff < mostFittingLengthDiff || this.mostFittingPath.length === 0) {
                    this.mostFittingPath = [...this.currentPath];
                }
            }

            if (currentCell.isStart) {
                return this.EndBacktract();;
            }

            currentCell.isBacktracked = true;
            let backtrackCell = this.getBacktrackCell(currentCell);
            
            if (backtrackCell === null) {
                return this.EndBacktract();
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

    private EndBacktract() : Cell[]
    {
        this.mostFittingPath[this.mostFittingPath.length - 1].isEnd = true;
        this.mostFittingPath.forEach(element => {
            element.isRightPath = true;
        });
        return [...this.mostFittingPath];
    }

    private getAvailableDirections(cell : Cell) : Direction[]
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

    private getBacktrackCell(cell : Cell) : Cell
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