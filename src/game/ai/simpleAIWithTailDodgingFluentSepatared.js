import { MOVEMENT_DIRECTION } from '../game'
import { TILE_SNAKE } from '../../constants/contentTypes'
export default class SimpleAIWithTailDodgingFluent{
	takeMove(game){
		const {foodTile, snakeHead, direction } = game

		let yDiff = foodTile[0]-snakeHead[0] // >0 DOWN
		let xDiff = foodTile[1]-snakeHead[1] // >0 RIGHT

		let action

		let focusX = ()=>{
			if(xDiff>0){ //right
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						action = game.turnLeft
						break
					case MOVEMENT_DIRECTION.RIGHT:
						action = game.turnForward
						break
					case MOVEMENT_DIRECTION.TOP:
						action = game.turnRight
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = game.turnLeft
						break
					default:break
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
						action = game.turnForward
						break
					default:break
				}
			}
		}
		let focusY = ()=>{
			if(yDiff>0){//down
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						action = game.turnForward
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
						default:break
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
						action = game.turnForward
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = game.turnRight
						break
					default:break
				}
			}
		}
		
		if(Math.abs(yDiff) > Math.abs(xDiff)) focusY()
		else focusX()

		let moves = shuffle([game.turnLeft,game.turnRight,game.turnForward])
		for(let move of [action,...moves]){
			if(move) move(game)

			let nextTile = game._getNextTile(game, game._bufferedDirection)
			if(!nextTile) continue //wall
			let boardTile = game.board[nextTile[0]][nextTile[1]]
			
			if((boardTile & TILE_SNAKE) === 0){
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