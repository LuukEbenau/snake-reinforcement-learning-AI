import AIBase from './AIBase'
import { MOVEMENT_DIRECTION } from '../game'
export default class SimpleAI extends AIBase{
	constructor(props){
		super(props)
		const self = this
		this.onGameStarted.subscribe(()=>this.takeBestMove(self))
		this.onMoveCompleted.subscribe(()=>this.takeBestMove(self))
	}
	takeBestMove(self){
		console.log('nextMove')
		const {foodTile, snakeHead, direction } = self

		let yDiff = foodTile[0]-snakeHead[0] // >0 DOWN
		let xDiff = foodTile[1]-snakeHead[1] // >0 RIGHT

		if(yDiff>0){//down
			switch(direction){
				case MOVEMENT_DIRECTION.BOTTOM:
					self.takeTurn(self)
					break
				case MOVEMENT_DIRECTION.RIGHT:
					self.turnRight()
					break
				case MOVEMENT_DIRECTION.TOP:
					self.turnRight()
					break
				case MOVEMENT_DIRECTION.LEFT:
					self.turnLeft()
					break
			}
		}
		else if(yDiff < 0){//up
			switch(direction){
				case MOVEMENT_DIRECTION.BOTTOM:
					self.turnRight(self)
					break
				case MOVEMENT_DIRECTION.RIGHT:
					self.turnLeft()
					break
				case MOVEMENT_DIRECTION.TOP:
					self.takeTurn(self)
					break
				case MOVEMENT_DIRECTION.LEFT:
					self.turnRight()
					break
			}
		}
		else{
			if(xDiff>0){ //right
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						self.turnLeft()
						break
					case MOVEMENT_DIRECTION.RIGHT:
						self.takeTurn(self)
						break
					case MOVEMENT_DIRECTION.TOP:
						self.turnRight()
						break
					case MOVEMENT_DIRECTION.LEFT:
						self.turnLeft()
						break
				}
			}
			else if(xDiff < 0){ //left
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						self.turnRight()
						break
					case MOVEMENT_DIRECTION.RIGHT:
						self.turnLeft()
						break
					case MOVEMENT_DIRECTION.TOP:
						self.turnLeft()
						break
					case MOVEMENT_DIRECTION.LEFT:
						self.takeTurn(self)
						break
				}
			}
		}
	}
}