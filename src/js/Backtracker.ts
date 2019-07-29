import { Cell } from './Cell';
import { Direction } from './DirectionEnum';

export class Backtracker {

    hasFinishMainPath : boolean = false;
    
    constructor(startingCell : Cell, mainPathSize : number)
    {
        this.NextCell(startingCell, mainPathSize);
    }

    public NextCell(currentCell : Cell, index : number) : void
    {
        let { surroundingCells, surroundingBorders } = currentCell;

        let availableDirections = this.getAvailableDirections(currentCell);

        if (availableDirections.length === 0) {
            
            if (!this.hasFinishMainPath) {
                currentCell.isEnd = true;
                this.hasFinishMainPath = true;
            }

            if (currentCell.isStart) {
                return;
            }

            currentCell.isBacktracked = true;
            let backtrackCell = this.getBacktrackCell(currentCell);
            
            if (backtrackCell === null) {
                return;
            }

            return this.NextCell(backtrackCell, 0);
        }
        
        let randomIndex = Math.floor(Math.random() * availableDirections.length);
        let randomDirection = availableDirections[randomIndex];

        surroundingBorders.get(randomDirection).isActive = false;
        surroundingCells.get(randomDirection).isOpen = true;

        return this.NextCell(surroundingCells[randomDirection], index === 0 ? 0 : index - 1);
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