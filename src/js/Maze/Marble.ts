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
    private currentCell : Cell;
    private acceleration : Point = null;
    private velocity : Point = null;
    public pixelPosition : Point = null;
    public size : number;

    constructor(startingCell : Cell, size : number) {
        this.size = size;
        this.currentCell = startingCell;
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
            const x = (this.currentCell.position.x + 0.5) * widthUnit;
            const y = (this.currentCell.position.y + 0.5) * heightUnit;
            this.pixelPosition = new Point(x, y);
        }

        this.ProcessInput();
        this.UpdateVelocity();
        this.UpdatePosition();
        this.Collision(widthUnit, heightUnit);
        this.ChangeCurrentCell(widthUnit, heightUnit);
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
        const {surroundingBorders, surroundingCells} = this.currentCell;

        surroundingBorders.forEach( border => {
            if (border != null && border.isActive) {
                this.CollisionBorder(border, widthUnit, heightUnit);
            }
        });

        surroundingCells.forEach( cell => {
            if (cell != null) {
                cell.surroundingBorders.forEach( border => {
                    if (border != null && border.isActive) {
                        this.CollisionBorder(border, widthUnit, heightUnit);
                    }
                });
            }
        });
    }

    private CollisionBorder(border : Border, widthUnit : number, heightUnit : number) : void
    {
        const smallestUnit = widthUnit > heightUnit ? heightUnit : widthUnit;
        const radius = this.size * smallestUnit / 2;

        const { x: vx, y: vy } = this.velocity;
        const { x: ax, y: ay } = this.acceleration;

        const startPoint = border.getStartPoint(widthUnit, heightUnit);
        const endPoint = border.getEndPoint(widthUnit, heightUnit);

        // Collision avec le début de la bordure
        if (this.pixelPosition.getDistance(startPoint) <= radius) {
            const angle = this.pixelPosition.getAngle(startPoint);
            this.pixelPosition = startPoint.substract(new Point(Math.cos(angle) * radius, Math.sin(angle) * radius));
            return;
        }

        // Collision avec la fin de la bordure
        if (this.pixelPosition.getDistance(endPoint) <= radius) {
            const angle = this.pixelPosition.getAngle(endPoint);
            this.pixelPosition = endPoint.substract(new Point(Math.cos(angle) * radius, Math.sin(angle) * radius));
            return;
        }

        // Collision avec une bordure horizontale
        if (border.orientation == Orientation.Horizontal
            && this.pixelPosition.x >= startPoint.x
            && this.pixelPosition.x <= endPoint.x) {
            
            // Si le centre est au dessus de la bordure mais que le cercle lui est sécant
            if (this.pixelPosition.y <= startPoint.y
             && this.pixelPosition.y + radius >= startPoint.y) {
                 this.pixelPosition.y = startPoint.y - radius;
                 this.velocity.y = - vy * 0.5;
                 this.acceleration.y = - ay * 0.5;
                 return;
            }

            // Si le centre est en dessous de la bordure mais que le cercle lui est sécant
            if (this.pixelPosition.y >= startPoint.y
             && this.pixelPosition.y - radius <= startPoint.y ) {
                this.pixelPosition.y = startPoint.y + radius;
                this.velocity.y = - vy * 0.5;
                this.acceleration.y = - ay * 0.5;
                return;
            }
        }
        
        // Collision avec une bordure verticale
        if (border.orientation == Orientation.Vertical
            && this.pixelPosition.y >= startPoint.y
            && this.pixelPosition.y <= endPoint.y) {
    
            // Si le centre est à gauche de la bordure mais que le cercle lui est sécant
            if (this.pixelPosition.x <= startPoint.x
             && this.pixelPosition.x + radius >= startPoint.x) {
                this.pixelPosition.x = startPoint.x - radius;
                this.velocity.x = - vx * 0.5;
                this.acceleration.x = - ax * 0.5;
                return;
            }

            // Si le centre est à droite de la bordure mais que le cercle lui est sécant
            if (this.pixelPosition.x >= startPoint.x
             && this.pixelPosition.x - radius <= startPoint.x ) {
                this.pixelPosition.x = startPoint.x + radius;
                this.velocity.x = - vx * 0.5;
                this.acceleration.x = - ax * 0.5;
                return;
            }
        }
    }

    private ChangeCurrentCell(widthUnit : number, heightUnit : number) : void
    {
        this.currentCell.surroundingCells.forEach(cell => {
            if (cell != null
             && this.pixelPosition.x <= (cell.position.x + 1) * widthUnit
             && this.pixelPosition.x >= cell.position.x * widthUnit
             && this.pixelPosition.y <= (cell.position.y + 1) * heightUnit
             && this.pixelPosition.y >= cell.position.y * heightUnit
             ) {
                 this.currentCell = cell;
            }
        })
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
    ) : void {
        let {x, y} = this.pixelPosition;
        let smallestUnit = widthUnit > heightUnit ? heightUnit : widthUnit;
        ctx.beginPath();
        ctx.arc(x, y, this.size * smallestUnit / 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
}