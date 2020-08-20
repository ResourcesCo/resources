export class NodeModel {
	constructor({document, path}) {
		this.document = document
		this.path = path
		this.value = document.valueAt(path)
	}
	
	get isObject() {
		return Object.prototype.toString.call(this.value) === '[object Object]'
	}
	
	get isEmpty() {
		return this.isObject && this.keys.length === 0
	}
	
	get keys() {
		return Object.keys(this.value)
	}
	
	get key() {
		return this.path[this.path.length - 1]
	}
}

export default class DocumentModel {
	constructor({value}) {
		this.value = value
	}
	
	forPath(path) {
		return new NodeModel({document: this, path})
	}
	
	valueAt(path) {
		let result = this.value
		for (const key of path) {
			result = result[key]
		}
		return result
	}
}