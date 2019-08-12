import { Maze } from "./Maze/Maze";
import { Context } from "./Utils/Context";

window.addEventListener('load', initMaze);

const MAZE_WIDTH = 7;
const MAZE_HEIGHT = 7;

function initMaze()
{
    const canvas = document.querySelector('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    window.addEventListener('resize', () => resize(canvas));
    const ctx = canvas.getContext('2d');
    const context = new Context(ctx, MAZE_WIDTH, MAZE_HEIGHT);
    const maze = new Maze(MAZE_WIDTH, MAZE_HEIGHT, 1000);

    Cycle(maze, context);
}

function resize(canvas: HTMLCanvasElement)
{
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function Cycle(maze : Maze, context : Context)
{
    const {ctx, width, height} = context.getContextDTO();
    
    ctx.clearRect(0, 0, width, height);
    maze.Update(context);
    maze.Draw(context);
    requestAnimationFrame(() => Cycle(maze, context))
}