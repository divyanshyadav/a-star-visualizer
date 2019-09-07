import p5 from 'p5';
import AStar from './AStar'
import Grid from './Grid'
import Cell from './Cell'

const CELL_WIDTH = 10
const CELL_HEIGHT = 10
const ANIMATION_DELAY = 60
const WALL_RANDOMNESS_PERCENT = 24
const DIAGONAL_NEIGHBORS = false

const GIRD_WIDTH = window.innerWidth
const GRID_HEIGHT = window.innerHeight
const ROWS = Math.floor(GIRD_WIDTH / CELL_WIDTH) - 1
const COLUMNS = Math.floor(GRID_HEIGHT / CELL_HEIGHT) - 1


// Globals
let aStar
let grid

let s = (sk) => {    
    sk.setup = () =>{
        sk.createCanvas(GIRD_WIDTH, GRID_HEIGHT)
        sk.frameRate(ANIMATION_DELAY)
    
        grid = new Grid({
            rows: ROWS,
            columns: COLUMNS,
            createCell: (row, column) => {
                return new Cell({
                    x: row,
                    y: column,
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT,
                    isWall: Math.random() < (WALL_RANDOMNESS_PERCENT / 100),
                    draw: function (color) {
                        sk.fill(color)
                        sk.noStroke(1)
                        sk.rect(this.x * this.width,
                            this.y * this.height,
                            this.width, this.height)
                    }
                })
            },
            diagonalNeighbors: DIAGONAL_NEIGHBORS
        })
    
        const start = grid.get(0, 0)
        const end = grid.getRandomCell({
            randomColumn: true
        })
    
        start.isWall = false
        end.isWall = false
    
        aStar = new AStar({
            start,
            end,
            delay: ANIMATION_DELAY
        })
    }

    sk.draw = () =>{
        const RED = sk.color(255, 0, 0)
        const GREEN = sk.color(0, 255, 0)
    
        drawVisitedCells(RED)
        drawWillBeVisiting(GREEN)
        checkAStarStatus()


        function drawShortestPath (color) {
            aStar.getShortestPath()
                .forEach(node => node.draw(color))
        }
        
        function checkAStarStatus () {
            const WHITE = sk.color(0)
            const BLACK = sk.color(255)
            const BLUE = sk.color(0, 0, 255)
        
            const state = aStar.getStatus()
        
            switch (state) {
            case 'waiting':
                drawGrid(WHITE, BLACK)
                drawEndCell(BLUE)
                aStar.search()
                break
        
            case 'success':
                drawShortestPath(BLUE)
                noLoop()
                break
        
            case 'failed':
                noLoop()
                break
        
            case 'searching':
                // console.log(state)
                break
            }
        }
        
        function drawGrid (openCellColor, closeCellColor) {
            grid.forEach(cell => {
                if (cell.isWall) {
                    cell.draw(openCellColor)
                } else {
                    cell.draw(closeCellColor)
                }
            })
        }
        
        function drawVisitedCells (color) {
            aStar.closeSet.forEach(c => {
                if (!c.drawn) {
                    c.draw(color)
                    c.drawn = true
                }
            })
        }
        
        function drawWillBeVisiting (color) {
            aStar.openSet.forEach(c => {
                c.draw(color)
            })
        }
        
        function drawEndCell (color) {
            aStar.end.draw(color)
        }
    }
}


new p5(s);