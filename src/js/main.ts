import { Maze } from "./Maze/Maze";

window.addEventListener('load', initMaze);

const MAZE_WIDTH = 20;
const MAZE_HEIGHT = 20;

function initMaze()
{
    const canvas = document.querySelector('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    window.addEventListener('resize', () => resize(canvas));
    const ctx = canvas.getContext('2d');
    const maze = new Maze(MAZE_WIDTH, MAZE_HEIGHT, 1000);

    Cycle(maze, ctx);
}

function resize(canvas: HTMLCanvasElement)
{
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function Cycle(maze : Maze, ctx : CanvasRenderingContext2D)
{
    const { width, height }  = ctx.canvas;

    const widthUnit = width / MAZE_WIDTH;
    const heightUnit = height / MAZE_HEIGHT;
    
    ctx.clearRect(0, 0, width, height);
    maze.Update(ctx, widthUnit, heightUnit);
    maze.Draw(ctx, widthUnit, heightUnit);
    requestAnimationFrame(() => Cycle(maze, ctx))
}