import queue from 'queue-fifo'
import { TILE_EMPTY, TILE_SNAKE, TILE_FOOD, TILE_SNAKE_HEAD } from '../constants/contentTypes'

export const MOVEMENT_DIRECTION = {
	TOP:0,
	RIGHT:1,
	BOTTOM:2,
	LEFT:3
}
export class SnakeGame{
	initialized = false
	started=false
	paused=false
	onGameEnded = null
	onGameStarted = null
	onGameTick = null
	direction
	turnTimer
	stats = {
		score:0,
		ticks:0,
	}

	_initialSize
	_rows
	_cols
	_bufferedDirection
	board = []

	snake = new queue()
	snakeHead = null

	constructor({rows, cols, speed = 1, initialSize=5}){
		this.speed = speed
		this._initialSize = initialSize
		this._rows = rows
		this._cols = cols

		this._generateBoard()
	}

	setupBoard(){
		console.log('setup board')
		let updatedTiles = []
		for(let y = 0; y< this.board.length; y++){
			let row = this.board[y]
			for(let x = 0; x < row.length; x++){
				row[x] = TILE_EMPTY
				updatedTiles.push([y,x])
			}
		}
		this.direction = MOVEMENT_DIRECTION.RIGHT
		this._bufferedDirection = null
		this._spawnSnake(this)
		this._spawnFood(this)
		this.onGameTick({updatedTiles:updatedTiles})
		this.initialized = true
	}

	//#region public methods
	start(){
		if(!this.initialized){
			console.error('not initialized before starting')
			return
		}
		this.stats = {
			score:0,
			ticks:0,
		}
		this.started = true
		let interval = (1 / this.speed) * 1000
		console.log('starting with interval',interval)
		const game = this

		this.turnTimer = setInterval(()=> {this._onGameTick(game)}, interval)

		if(this.onGameStarted) this.onGameStarted()
	}

	pause(){
		this.paused = true
	}
	unPause(){
		this.paused = false
	}


	turnRight(){
		let direction = this.direction+1
		if(direction > MOVEMENT_DIRECTION.LEFT) direction = MOVEMENT_DIRECTION.TOP
		this._bufferedDirection = direction
	}

	turnLeft(){
		let direction = this.direction-1
		if(direction < MOVEMENT_DIRECTION.TOP) direction = MOVEMENT_DIRECTION.LEFT
		this._bufferedDirection = direction
	}
	//#endregion

	//#region private methods
	_spawnSnake(game){
		let tiles = []

		let y = game._rows - 2
		game.snake.clear()
		for(let i = 0; i < game._initialSize; i++){
			const x = i + 1
			const pos = [y, x]
			game.snake.enqueue(pos)
			game.board[y][x] = TILE_SNAKE
			tiles.push(pos)
			
		}

		let head = tiles[tiles.length-1]
		game.board[head[0]][head[1]] = TILE_SNAKE|TILE_SNAKE_HEAD
		game.snakeHead = head
		console.log('snake', game.snake)
		return tiles
	}

	_changeDirection(direction){
		this.direction = direction
	}
	_generateBoard(){
		for(let y = 0; y < this._rows; y++){
			let row = []
			for(let x = 0; x < this._cols; x++){
				row.push(TILE_EMPTY)
			}
			this.board.push(row)
		}
	}

	_onGameTick(game){
		if(game.started && !game.paused){
			game._move(game)
		}
	}

	_getNextTile(game, direction){
		let head = game.snakeHead
		let newTile
		switch(direction){
			case MOVEMENT_DIRECTION.TOP:
				newTile = [head[0]-1,head[1]]
			break
			case MOVEMENT_DIRECTION.BOTTOM:
				newTile = [head[0]+1,head[1]]
			break
			case MOVEMENT_DIRECTION.RIGHT:
				newTile = [head[0],head[1]+1]
			break
			case MOVEMENT_DIRECTION.LEFT:
				newTile = [head[0],head[1]-1]
			break
			default:
				console.error('unknown direction',direction)
				return
		}
		return newTile
	}

	_collisionOccured(game, tile){
		let x = tile[1]
		let y = tile[0]
		if(x<0|| y<0) return true

		if(y >= game.board.length) return true
		if(x >= game.board[0].length) return true

		if((game.board[y][x] & TILE_SNAKE) > 0){
			console.log('hit tail')
			return true
		}
	}

	_spawnFood(game){
		while(true){
			 let x = Math.floor(Math.random() * (game._cols - 1))
			 let y = Math.floor(Math.random() * (game._rows - 1))
			 if(game.board[y][x] === TILE_EMPTY){
				 game.board[y][x] = TILE_FOOD
				 console.log('spawning food at',[y,x])
				 return [y,x]
			 }
		}
	}

	_gameOver(game){
		game.started = false
		game.initialized = false
		clearInterval(this.turnTimer)
		if(game.onGameEnded) game.onGameEnded(game.stats)
	}

	_move(game){
		if(game._bufferedDirection === null) game._bufferedDirection = game.direction
		game.direction = game._bufferedDirection
		let newTile = game._getNextTile(game, game.direction)

		if(this._collisionOccured(game, newTile)){
			game._gameOver(game)
			return
		}
		
		game.board[game.snakeHead[0]][game.snakeHead[1]] = TILE_SNAKE
		let updatedTiles = [newTile, game.snakeHead]
		game.snakeHead = newTile

		const boardTile = game.board[newTile[0]][newTile[1]]

		
		game.snake.enqueue(newTile)
		game.board[newTile[0]][newTile[1]] = TILE_SNAKE|TILE_SNAKE_HEAD
		if(boardTile === TILE_FOOD){
			updatedTiles.push(this._spawnFood(game))
			game.stats.score++
		}
		else{
			let tailToRemove = this.snake.dequeue()
			game.board[tailToRemove[0]][tailToRemove[1]] = TILE_EMPTY

			updatedTiles.push(tailToRemove)
		}

		game.stats.ticks++

		if(game.onGameTick) game.onGameTick({
			updatedTiles
		})
	}

	//#endregion
}