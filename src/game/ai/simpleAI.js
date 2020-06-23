import { MOVEMENT_DIRECTION } from '../game'
export default class SimpleAI {
	takeMove(game){
		const {foodTile, snakeHead, direction } = game

		let yDiff = foodTile[0]-snakeHead[0] // >0 DOWN
		let xDiff = foodTile[1]-snakeHead[1] // >0 RIGHT

		if(yDiff>0){//down
			switch(direction){
				case MOVEMENT_DIRECTION.BOTTOM:
					game.takeTurn(game)
					break
				case MOVEMENT_DIRECTION.RIGHT:
					game.turnRight()
					break
				case MOVEMENT_DIRECTION.TOP:
					game.turnRight()
					break
				case MOVEMENT_DIRECTION.LEFT:
					game.turnLeft()
					break
			}
		}
		else if(yDiff < 0){//up
			switch(direction){
				case MOVEMENT_DIRECTION.BOTTOM:
					game.turnRight(game)
					break
				case MOVEMENT_DIRECTION.RIGHT:
					game.turnLeft()
					break
				case MOVEMENT_DIRECTION.TOP:
					game.takeTurn(game)
					break
				case MOVEMENT_DIRECTION.LEFT:
					game.turnRight()
					break
			}
		}
		else{
			if(xDiff>0){ //right
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						game.turnLeft()
						break
					case MOVEMENT_DIRECTION.RIGHT:
						game.takeTurn(game)
						break
					case MOVEMENT_DIRECTION.TOP:
						game.turnRight()
						break
					case MOVEMENT_DIRECTION.LEFT:
						game.turnLeft()
						break
				}
			}
			else if(xDiff < 0){ //left
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						game.turnRight()
						break
					case MOVEMENT_DIRECTION.RIGHT:
						game.turnLeft()
						break
					case MOVEMENT_DIRECTION.TOP:
						game.turnLeft()
						break
					case MOVEMENT_DIRECTION.LEFT:
						game.takeTurn(game)
						break
				}
			}
		}
	}
}