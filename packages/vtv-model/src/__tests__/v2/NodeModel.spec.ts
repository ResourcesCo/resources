import { describe, test, expect } from '@jest/globals'
import NodeModel from 'vtv-model/v2/NodeModel'

describe('NodeModel', () => {
  it('should create a model', () => {
    const model = new NodeModel({data: {}});
    expect(model.type).toEqual('object');
  });

  it('should return the correct type', () => {
    for (const [value, type] of [[{}, 'object'], [[], 'array']]) {
      const model = new NodeModel({data: value});
      expect(model.type).toEqual(type);
    }
  });
});