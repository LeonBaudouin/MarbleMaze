import { Maze } from "./Maze";

window.addEventListener('load', initMaze);

function initMaze()
{
    const canvas = document.querySelector('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    window.addEventListener('resize', () => resize(canvas));
    const ctx = canvas.getContext('2d');
    const maze = new Maze(20, 20, 1000);

    Draw(maze, ctx);
}

function resize(canvas: HTMLCanvasElement)
{
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function Draw(maze : Maze, ctx : CanvasRenderingContext2D)
{
    maze.Draw(ctx);
    requestAnimationFrame(() => Draw(maze, ctx))
}