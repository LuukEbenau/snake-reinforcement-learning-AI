import React, { Component } from 'react'
import Tile from '../tile'
import styles from './board.module.scss'
import KeyboardEventHandler from 'react-keyboard-event-handler';
import {Row, Container} from 'react-bootstrap'

import { SnakeGame } from '../../game/game';

import simpleAIWithTailDodgingSafe from '../../game/ai/simpleAIWithTailDodgingSafe';
import simpleAIWithTailDodgingFluentSepatared from '../../game/ai/simpleAIWithTailDodgingFluentSepatared'
import simpleAIWithTailDodging from '../../game/ai/simpleAIWithTailDodging'
import simpleAIWithTailDodgingFluent from '../../game/ai/simpleAIWithTailDodgingFluent'
import simpleAIWithTailDodgingFluentRandom from '../../game/ai/simpleAIWithTailDodgingFluentRandom'

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
		this.tileSize = this.state.boardWidth / this.props.cols

		this.game = new SnakeGame({rows: this.props.rows, cols: this.props.cols, speed: 6, interval:.1})

		this.game.onGameStarted.subscribe(() => console.log('game started'))
		this.game.onGameEnded.subscribe((e) => {
			this.setState({gameStarted:false})
			console.log('game ended',e)
		})
		this.game.onBoardUpdated.subscribe(e => this.onGameTick(e))
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
		else if(key === 'space'){
			if(!this.state.gameStarted) this.startGame()
		}
	}



	render() { 
		let selectedPlayerChanged = (e) =>{
			let player
			console.log(e.target.value)
			switch(e.target.value){
				case 'fluent': 
					player = new simpleAIWithTailDodgingFluent()
				break
				case 'fluent_rand': 
					player = new simpleAIWithTailDodgingFluentRandom()
				break
				case 'tail_dodge': 
					player = new simpleAIWithTailDodging()
				break
				case 'safe': 
					player = new simpleAIWithTailDodgingSafe()
				break
			}

			this.setState({player1:player})
		}
		return ( 
			<Container>
				<KeyboardEventHandler handleKeys={['left','right','space']} onKeyEvent={(key)=>{this.onKeyboardEvent(this,key)}}></KeyboardEventHandler>
				<Row className="justify-content-md-center">
					<div className="col-8">
						<div style={{backgroundColor:'green'}}>
							<p>Score: {this.game.stats.score} Ticknr: {this.game.stats.ticks}</p>
						</div>
						<div className={styles.board} style={{width:this.state.boardWidth, height:this.state.boardHeight, lineHeight:0}}>
							{this.state.tiles}
						</div>
						<div style={{backgroundColor:'red'}}>
							<button className="btn btn-primary" onClick={()=>this.startGame()} disabled={this.state.gameStarted || !this.state.player1}>Start</button>
							<select value="" onChange={selectedPlayerChanged} disabled={this.state.gameStarted}>
								<option value="fluent">tail dodge fluent</option>
								<option value="fluent_rand">tail dodge fluent random</option>
								<option value="tail_dodge">tail dodge</option>
								<option value="safe">safety first</option>
							</select>
						</div>
					</div>
				</Row>

			</Container>
		 )
	}

	startGame(){
		this.game.setupBoard(this.state.player1)
		this.setState({gameStarted:true})
		let timeout = 5
		let timeoutHandle = setInterval(()=>{
			if(timeout-- === 0){
				console.log('timeout finished')
				this.game.start()
				clearTimeout(timeoutHandle)
			}
			else{
				console.log(timeout+' seconds')
			}
		},100)
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