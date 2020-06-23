import { MOVEMENT_DIRECTION } from '../game'
import { TILE_SNAKE, TILE_FOOD } from '../../constants/contentTypes'
import queue from 'queue-fifo'
export default class SimpleAIWithTailDodging {
	moveQueue = new queue()
	takeMove(game){
		const {foodTile, snakeHead, direction } = game

		let targetTile = foodTile

		if(!this.moveQueue.isEmpty()){
			targetTile = this.moveQueue.peek()
		}

		let yDiff = targetTile[0]-snakeHead[0] // >0 DOWN
		let xDiff = targetTile[1]-snakeHead[1] // >0 RIGHT

		let action

		if(xDiff>0){ //right
			switch(direction){
				case MOVEMENT_DIRECTION.BOTTOM:
					action = game.turnLeft
					break
				case MOVEMENT_DIRECTION.RIGHT:

					break
				case MOVEMENT_DIRECTION.TOP:
					action = game.turnRight
					break
				case MOVEMENT_DIRECTION.LEFT:
					action = game.turnLeft
					break
			}
		}
		else if(xDiff < 0){ //left
			switch(direction){
				case MOVEMENT_DIRECTION.BOTTOM:
					action = game.turnRight
					break
				case MOVEMENT_DIRECTION.RIGHT:
					action = game.turnLeft
					break
				case MOVEMENT_DIRECTION.TOP:
					action = game.turnLeft
					break
				case MOVEMENT_DIRECTION.LEFT:

					break
			}
		}
		else{
			if(yDiff>0){//down
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						break
					case MOVEMENT_DIRECTION.RIGHT:
						action = game.turnRight
						break
					case MOVEMENT_DIRECTION.TOP:
						action = game.turnRight
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = game.turnLeft
						break
				}
			}
			else if(yDiff < 0){//up
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						action = game.turnRight
						break
					case MOVEMENT_DIRECTION.RIGHT:
						action = game.turnLeft
						break
					case MOVEMENT_DIRECTION.TOP:
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = game.turnRight
						break
				}
			}
		}

		let moves = shuffle([game.turnLeft,game.turnRight,game.turnForward])
		for(let move of [action,...moves]){
			if(move) move(game)

			let nextTile = game._getNextTile(game,game._bufferedDirection)
			if(!nextTile) continue

			let boardTile = game.board[nextTile[0]][nextTile[1]]
			
			if(!this.moveQueue.isEmpty()){
				if(arraysMatch(nextTile, this.moveQueue.peek())){
					this.moveQueue.dequeue()
				}
			}
			else if(boardTile === TILE_FOOD){
				const tile1 = [nextTile[0],game._cols-1]
				if(!arraysMatch(nextTile, tile1)) this.moveQueue.enqueue(tile1)

				const tile2 = [game._rows-1,game._cols-1]
				if(!arraysMatch(nextTile, tile2)) this.moveQueue.enqueue(tile2)

				const tile3 = [game._rows-1,0]
				if(!arraysMatch(nextTile,tile3)) this.moveQueue.enqueue(tile3)

				const tile4 = [0,0]
				if(!arraysMatch(nextTile, tile4)) this.moveQueue.enqueue(tile4)
			}

			if((boardTile & TILE_SNAKE) == 0){
				break
			}
		}

		let c = () =>	game.takeTurn(game)
		if(game.interval === 0)	c()
		else setTimeout(c,game.interval*1000)
	}
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function arraysMatch(arr1, arr2) {
	if (arr1.length !== arr2.length) return false
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false
	}

	return true
}
