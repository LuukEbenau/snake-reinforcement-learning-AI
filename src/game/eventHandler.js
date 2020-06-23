export class EventHandler{
	listeners = []
	subscribe(handler){
		this.listeners.push(handler)
	}
	unsubscribe(handler){
		let index = this.listeners.indexOf(handler)
		if(index !== -1){
			this.listeners.splice(index,1)
		}
	}
	trigger(data){
		for(let listener of this.listeners){
			listener(data)
		}
	}
	clear(){
		this.listeners = []
	}
}