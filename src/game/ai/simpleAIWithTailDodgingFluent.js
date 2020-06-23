import AIBase from './AIBase'
import { MOVEMENT_DIRECTION } from '../game'
import { TILE_SNAKE } from '../../constants/contentTypes'
export default class SimpleAIWithTailDodgingFluent extends AIBase{
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

		let action

		let focusX = ()=>{
			if(xDiff>0){ //right
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						action = self.turnLeft
						break
					case MOVEMENT_DIRECTION.RIGHT:
						action = self.turnForward
						break
					case MOVEMENT_DIRECTION.TOP:
						action = self.turnRight
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = self.turnLeft
						break
					default:break
				}
			}
			else if(xDiff < 0){ //left
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						action = self.turnRight
						break
					case MOVEMENT_DIRECTION.RIGHT:
						action = self.turnLeft
						break
					case MOVEMENT_DIRECTION.TOP:
						action = self.turnLeft
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = self.turnForward
						break
					default:break
				}
			}
		}
		let focusY = ()=>{
			if(yDiff>0){//down
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						action = self.turnForward
						break
					case MOVEMENT_DIRECTION.RIGHT:
						action = self.turnRight
						break
					case MOVEMENT_DIRECTION.TOP:
						action = self.turnRight
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = self.turnLeft
						break
						default:break
				}
			}
			else if(yDiff < 0){//up
				switch(direction){
					case MOVEMENT_DIRECTION.BOTTOM:
						action = self.turnRight
						break
					case MOVEMENT_DIRECTION.RIGHT:
						action = self.turnLeft
						break
					case MOVEMENT_DIRECTION.TOP:
						action = self.turnForward
						break
					case MOVEMENT_DIRECTION.LEFT:
						action = self.turnRight
						break
					default:break
				}
			}
		}
		
		if(Math.abs(yDiff) > Math.abs(xDiff)) focusY()
		else focusX()

		let moves = shuffle([self.turnLeft,self.turnRight,self.turnForward])
		for(let move of [action,...moves]){
			if(move) move(self)

			let nextTile = self._getNextTile(self, self._bufferedDirection)
			if(!nextTile) continue //wall
			let boardTile = self.board[nextTile[0]][nextTile[1]]
			
			if((boardTile & TILE_SNAKE) === 0){
				break
			}
		}

		let c = () =>	self.takeTurn(self)
		if(self.interval === 0)	c()
		else setTimeout(c,self.interval*1000)
	}
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}