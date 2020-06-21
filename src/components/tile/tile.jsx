import React, { Component } from 'react'
import styles from './tile.module.scss'
import {TILE_EMPTY,TILE_SNAKE,TILE_FOOD, TILE_SNAKE_HEAD} from '../../constants/contentTypes'
export default class Tile extends Component {
	constructor(props){
		super(props)
	}
	render() {
		let tileClass = styles.emptyTile
		let c = this.props.content
		if((c & TILE_SNAKE_HEAD) > 0) tileClass = styles.snakeHeadTile
		else if((c & TILE_SNAKE) > 0) tileClass = styles.snakeTile
		else if((c & TILE_FOOD) > 0) tileClass = styles.foodTile
		else tileClass = styles.emptyTile

		return (
			<div style={{width:this.props.width, height:this.props.height}} className={[styles.tile, tileClass].join(' ')}>

			</div>
		)
	}
}
