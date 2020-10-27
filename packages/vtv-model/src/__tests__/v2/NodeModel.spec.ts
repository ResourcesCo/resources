import { describe, test, expect } from '@jest/globals'
import NodeModel from 'vtv-model/v2/NodeModel'

describe('NodeModel', () => {
  it('should create a model', () => {
    const model = new NodeModel({value: {}});
    expect(model.type).toEqual('object');
  });

  it('should return the correct type', () => {
    for (const [value, type] of [[{}, 'object'], [[], 'array'], ['', 'string']]) {
      const model = new NodeModel({value});
      expect(model.type).toEqual(type);
    }
  });

  it('should have an empty path', () => {
    const model = new NodeModel({value: {}});
    expect(model.path).toEqual([]);
  });

  it('should be expandable when there are items inside', () => {
    const model1 = new NodeModel({value: {}});
    expect(model1.isExpandable).toBe(false);
    const model2 = new NodeModel({value: {hello: 'world'}});
    expect(model2.isExpandable).toBe(true);
  });

  it('should not be expanded', () => {
    const model = new NodeModel({value: {hello: 'world'}});
    expect(model.isExpanded).toEqual(false);
  });

  it('should expand and collapse nodes', () => {
    const model = new NodeModel({value: {hello: 'world'}});
    model.expand();
    expect(model.isExpanded).toEqual(true);
    model.collapse();
    expect(model.isExpanded).toEqual(false);
  });

  it('should support being expanded when constructed', () => {
    const model = new NodeModel({value: {hello: 'world'}, expanded: true});
    expect(model.isExpanded).toBe(true);
  });

  it('should get a list of children to display', () => {
    const model = new NodeModel({value: {hello: 'world'}, expanded: true});
    expect(model.children.length).toEqual(1);
    expect(model.children[0].path).toEqual(['hello']);
  });
});