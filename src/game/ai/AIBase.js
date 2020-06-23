import {SnakeGame} from '../game'
export default class AIBase extends SnakeGame{
	constructor(props){
		super(props)
		const {interval} = props
		this.interval = interval || 0
	}
}