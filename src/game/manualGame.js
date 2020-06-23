import {SnakeGame} from './game'

export class ManualGame extends SnakeGame{
	turnTimer
	constructor(props){
		super(props)
		const {speed} = props

		this.speed = speed
	}
	start(){
		super.start()
		let interval = (1 / this.speed) * 1000
		console.log('starting with interval',interval)
		const game = this

		this.turnTimer = setInterval(() => {this.takeTurn(game)}, interval)
	}

	_gameOver(game){
		clearInterval(this.turnTimer)
		super._gameOver(game)
	}
}