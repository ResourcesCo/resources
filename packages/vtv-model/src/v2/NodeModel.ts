export default class NodeModel {
  type: string;
  constructor({data}) {
    if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
      this.type = 'object';
    } else if (Array.isArray(data)) {
      this.type = 'array';
    }
  }
}