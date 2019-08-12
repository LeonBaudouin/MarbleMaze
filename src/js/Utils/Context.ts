import { ContextDTO } from './ContextDTO';

export class Context {

    private ctx : CanvasRenderingContext2D;
    private mazeWidth : number;
    private mazeHeight : number;
    private height : number;
    private width : number;
    private static instance : Context;

    constructor(
        ctx : CanvasRenderingContext2D,
        mazeWidth : number,
        mazeHeight : number
    ) {
        if (Context.instance) {
            throw "Context already existing";
        }
        Context.instance = this;
        this.ctx = ctx;
        this.mazeWidth = mazeWidth;    
        this.mazeHeight = mazeHeight;
    }

    public static getInstance()
    {
        if (Context.instance == null) {
            throw "You must instantiate a context first";
        }
        return this.instance;
    }

    public getCtx() : CanvasRenderingContext2D
    {
        return this.ctx;
    }
    
    public getMazeWidth() : number
    {
        return this.mazeWidth;
    }
    
    public getMazeHeight() : number
    {
        return this.mazeHeight;
    }
    
    public getWidthUnit() : number
    {
        return this.getWidth() / this.getMazeWidth();
    }
    
    public getHeightUnit() : number
    {
        return this.getHeight() / this.getMazeHeight();
    }

    public getWidth() : number
    {
        return this.ctx.canvas.width;
    }

    public getHeight() : number
    {
        return this.ctx.canvas.height;
    }

    public getContextDTO() : ContextDTO
    {
        return {
            ctx : this.getCtx(),
            widthUnit : this.getWidthUnit(),
            heightUnit : this.getHeightUnit(),
            mazeWidth : this.getMazeWidth(),
            mazeHeight : this.getMazeHeight(),
            width : this.getWidth(),
            height : this.getHeight()
        };
    }
    
}