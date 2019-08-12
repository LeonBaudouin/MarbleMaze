import { Cell } from './Cell';
import { Point } from '../Utils/Point';
import { IDrawable } from '../Interface/IDrawable';
import { IUpdatable } from '../Interface/IUpdatable';
import { OrientationListener } from '../Event/OrientationListener';
import { MouseMoveListener } from '../Event/MouseMoveListener';
import { Border } from './Border';
import { Orientation } from '../Enum/OrientationEnum';
import { Context } from '../Utils/Context';
import { Direction } from '../Enum/DirectionEnum';

export class Marble implements IDrawable, IUpdatable
{

    private listener : OrientationListener;
    private mouse : MouseMoveListener;
    private currentCell : Cell;
    private acceleration : Point = null;
    private velocity : Point = null;
    private collisionAngle : number = null;
    public pixelPosition : Point = null;
    public size : number;

    constructor(startingCell : Cell, size : number) {
        this.size = size;
        this.currentCell = startingCell;
        this.acceleration = new Point(0, 0);
        this.velocity = new Point(0, 0);
        this.listener = OrientationListener.getInstance();
        this.mouse = MouseMoveListener.getInstance();
    }
    
    public Update(context : Context) : void
    {
        const {widthUnit, heightUnit} = context.getContextDTO();
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
        let newVelocity = this.velocity.add(this.acceleration);
        let normalVelocity = new Point(0, 0);

        if (this.collisionAngle != null) {
            const diffAngle = this.collisionAngle - (new Point(0,0)).getAngle(newVelocity);
            const ponderedDiffAngle = diffAngle > Math.PI ? diffAngle - Math.PI * 2 : diffAngle < - Math.PI ? diffAngle + Math.PI * 2 : diffAngle;
            if (Math.abs(ponderedDiffAngle) < Math.PI / 2) {
                const normalVelocityMagnitude = newVelocity.getMagnitude() * Math.cos(diffAngle);
                normalVelocity = Point.CreateFromPolar(this.collisionAngle, normalVelocityMagnitude);
            }
        }

        this.velocity = newVelocity.substract(normalVelocity);
    }

    private UpdatePosition() : void
    {    
        this.pixelPosition = this.pixelPosition.add(this.velocity);
    }

    private Collision(widthUnit : number, heightUnit : number) : void
    {
        const {surroundingBorders, surroundingCells} = this.currentCell;

        const horizontalBorders : Border[] = [];
        const verticalBorders : Border[] = [];

        surroundingBorders.forEach( border => {
            if (border != null && border.isActive) {
                if (border.orientation == Orientation.Horizontal) {
                    horizontalBorders.push(border);
                } else {
                    verticalBorders.push(border);
                }
            }
        });
        
        surroundingCells.forEach( cell => {
            if (cell != null) {
                cell.surroundingBorders.forEach( border => {
                    if (border != null && border.isActive) {
                        if (border.orientation == Orientation.Horizontal) {
                            horizontalBorders.push(border);
                        } else {
                            verticalBorders.push(border);
                        }
                    }
                });
            }
        });

        let collisionAngle = null;

        for (const border of horizontalBorders.filter((value, index, self) => self.indexOf(value) === index )) {
            const collided = this.CollisionBorder(border, widthUnit, heightUnit);
            if (collided != null) {
                collisionAngle = collided;
                break;
            }
        }
        
        for (const border of verticalBorders.filter((value, index, self) => self.indexOf(value) === index )) {
            const collided = this.CollisionBorder(border, widthUnit, heightUnit);
            if (collided != null) {
                collisionAngle = collided
                break;
            }
        }

        this.collisionAngle = collisionAngle;
    }

    private CollisionBorder(border : Border, widthUnit : number, heightUnit : number) : number
    {
        const smallestUnit = widthUnit > heightUnit ? heightUnit : widthUnit;
        const radius = this.size * smallestUnit / 2;

        const {x: vx, y: vy} = this.velocity;
        const { x: ax, y: ay } = this.acceleration;

        const startPoint = border.getStartPoint();
        const endPoint = border.getEndPoint();

        // Collision avec une bordure horizontale
        if (border.orientation == Orientation.Horizontal) {

            if (this.pixelPosition.x >= startPoint.x
             && this.pixelPosition.x <= endPoint.x) {
                // Si le centre est au dessus de la bordure mais que le cercle lui est sécant
                if (this.pixelPosition.y <= startPoint.y
                 && this.pixelPosition.y + radius >= startPoint.y) {
                    this.pixelPosition.y = startPoint.y - radius;
                    this.velocity.y = - vy * 0.5;
                    return Math.PI / 2;
                }

                // Si le centre est en dessous de la bordure mais que le cercle lui est sécant
                if (this.pixelPosition.y >= startPoint.y
                 && this.pixelPosition.y - radius <= startPoint.y ) {
                    this.pixelPosition.y = startPoint.y + radius;
                    this.velocity.y = - vy * 0.5;
                    return - Math.PI / 2;
                }
            }

            if (endPoint.getDistance(this.pixelPosition) <= radius + 0.0001) {
                const rightBorder = border.surroundingBorders.get(Direction.Right);
                const angle = endPoint.getAngle(this.pixelPosition);
                if (angle > - Math.PI / 2 && angle < Math.PI / 2
                 && (rightBorder == null || !rightBorder.isActive)) {
                    this.onCollideOnPoint(endPoint, radius);
                    return angle + Math.PI;
                }
            }

            if (startPoint.getDistance(this.pixelPosition) <= radius + 0.0001) {
                const leftBorder = border.surroundingBorders.get(Direction.Left);
                const angle = startPoint.getAngle(this.pixelPosition);
                if (((angle < - Math.PI / 2 && angle > - Math.PI) || (angle < Math.PI && angle > Math.PI / 2))
                 && (leftBorder == null || !leftBorder.isActive)) {
                    this.onCollideOnPoint(startPoint, radius);
                    return angle + Math.PI;
                }
            }
        }

        // Collision avec une bordure verticale
        if (border.orientation == Orientation.Vertical) {

            if (this.pixelPosition.y >= startPoint.y
             && this.pixelPosition.y <= endPoint.y) {
                // Si le centre est à gauche de la bordure mais que le cercle lui est sécant
                if (this.pixelPosition.x <= startPoint.x
                 && this.pixelPosition.x + radius >= startPoint.x) {
                    this.pixelPosition.x = startPoint.x - radius;
                    this.velocity.x = - vx * 0.5;
                    return 0;
                }
    
                // Si le centre est à droite de la bordure mais que le cercle lui est sécant
                if (this.pixelPosition.x >= startPoint.x
                 && this.pixelPosition.x - radius <= startPoint.x ) {
                    this.pixelPosition.x = startPoint.x + radius;
                    this.velocity.x = - vx * 0.5;
                    return Math.PI;
                }
            }

            if (endPoint.getDistance(this.pixelPosition) <= radius + 0.0001) {
                const downBorder = border.surroundingBorders.get(Direction.Down);
                const angle = endPoint.getAngle(this.pixelPosition);
                if (angle > 0 && angle < Math.PI
                 && (downBorder == null || !downBorder.isActive)) {
                    this.onCollideOnPoint(endPoint, radius);
                    return angle + Math.PI;
                }
            }

            if (startPoint.getDistance(this.pixelPosition) <= radius + 0.0001) {
                const upBorder = border.surroundingBorders.get(Direction.Up);
                const angle = startPoint.getAngle(this.pixelPosition);
                if (angle < 0 && angle > - Math.PI
                 && (upBorder == null || !upBorder.isActive)) {
                    this.onCollideOnPoint(startPoint, radius);
                    return angle + Math.PI;
                }
            }
        }

        return null;
    }

    private onCollideOnPoint(point : Point, radius : number) : void
    {
        const incidenceAngle = this.acceleration.getAngle(new Point(0, 0));
        
        const wallNormalAngle = point.getAngle(this.pixelPosition);
        const differenceAngle = wallNormalAngle - incidenceAngle;
        const reflectionAngle = incidenceAngle + 2 * differenceAngle;

        this.pixelPosition = point.add(Point.CreateFromPolar(wallNormalAngle, radius));
        this.velocity = Point.CreateFromPolar(reflectionAngle, this.velocity.getMagnitude() / 2);
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
        // let { beta, gamma } = this.listener.getValue();
        
        // const pitch = Math.PI * beta / 180;
        // const roll = Math.PI * gamma / 180;

        // const x = Math.cos(pitch) * Math.sin(roll) * 0.2;
        // const y = Math.sin(pitch) * 0.2;

        let { x, y } = this.mouse.getValue();

        

        x = (x - this.pixelPosition.x) / 600;
        y = (y - this.pixelPosition.y) / 600;

        this.acceleration = new Point(x, y);
    }

    public Draw(context : Context) : void
    {
        const {ctx, widthUnit, heightUnit, width, height} = context.getContextDTO();
        const {x, y} = this.pixelPosition;
        const smallestUnit = widthUnit > heightUnit ? heightUnit : widthUnit;
        ctx.beginPath();
        ctx.arc(x, y, this.size * smallestUnit / 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();

        const center = new Point(width/2, height/2);
        ctx.beginPath();
        ctx.arc(center.x, center.y, 200, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center.x, center.y, 1, 0, 2 * Math.PI);
        ctx.fill();

    }
}

const p = document.querySelector('p');