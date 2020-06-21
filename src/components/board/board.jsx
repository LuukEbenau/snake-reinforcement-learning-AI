import React, { Component, createRef } from 'react'
import Tile from '../tile'
import styles from './board.module.scss'
import { SnakeGame } from '../../game/game'
import { TILE_SNAKE, TILE_EMPTY } from '../../constants/contentTypes'
import KeyboardEventHandler from 'react-keyboard-event-handler';
import {Row, Container, Col} from 'react-bootstrap'
class Board extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			tiles: [],
			boardWidth: 600,
			boardHeight: 600,
			rows: this.props.rows,
			cols: this.props.cols,
			gameStarted:false
		}
		this.game = new SnakeGame({rows: this.props.rows, cols: this.props.cols, speed: 6})

		this.tileSize = this.state.boardWidth / this.game.board.length

		this.game.onGameStarted = () => console.log('game started')
		this.game.onGameEnded = (e) => {
			this.setState({gameStarted:false})
			console.log('game ended',e)
		}
		this.game.onGameTick = e => this.onGameTick(e)
	}
	onGameTick({updatedTiles}){
		this.updateBoard(updatedTiles)
	}

	onKeyboardEvent(visualBoard, key){
		if(key === 'left'){
			visualBoard.game.turnLeft()
		}
		else if(key === 'right'){
			visualBoard.game.turnRight()
		}
	}

	render() { 
		return ( 
			<Container>
				<KeyboardEventHandler handleKeys={['left','right']} onKeyEvent={(key)=>{this.onKeyboardEvent(this,key)}}></KeyboardEventHandler>
				<Row className="justify-content-md-center">
					<div className="col-8">
						<div style={{backgroundColor:'green'}}>
							<p>Score: {this.game.stats.score} Ticknr: {this.game.stats.ticks}</p>
						</div>
						<div className={styles.board} style={{width:this.state.boardWidth, height:this.state.boardHeight, lineHeight:0}}>
							{this.state.tiles}
						</div>
						<div style={{backgroundColor:'red'}}>
							<button className="btn btn-primary" onClick={()=>this.startGame()} disabled={this.state.gameStarted}>Start</button>
						</div>
					</div>
				</Row>

			</Container>
		 )
	}

	startGame(){
		this.game.setupBoard()
		this.setState({gameStarted:true})
		let timeout = 3
		let timeoutHandle = setInterval(()=>{
			if(timeout-- === 0){
				console.log('timeout finished')
				this.game.start()
				clearTimeout(timeoutHandle)
			}
			else{
				console.log(timeout+' seconds')
			}
		},1000)
	}

	updateBoard(tilesToUpdate){
		let tiles = this.state.tiles
		for(let tile of tilesToUpdate){
			let x = tile[1]
			let y = tile[0]
			let newState = this.game.board[y][x]

			let row = [].concat(tiles[y])

			row[x] = <Tile key={x+'-'+y} height={this.tileSize} width={this.tileSize} content={newState}></Tile>
			tiles[y] = row
		}

		this.setState({tiles:tiles})
	}

	generateBoard(){
		let tiles = []
		for(let y = 0; y < this.game.board.length; y++){
			let row = []
			let boardRow = this.game.board[y]
			for(let x = 0; x < boardRow.length; x++){			
				let tile = <Tile key={x+'-'+y} height={this.tileSize} width={this.tileSize} content={boardRow[x]}></Tile>
				row.push(tile)
			}
			tiles.push(row)
		}
		this.setState({tiles: tiles})
	}

	componentDidMount(){	
		this.generateBoard()
	}
}
 
export default Board