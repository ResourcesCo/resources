export class NodeType {
  get baseType() {
    return ''
  }

  get isObject() {
    return false
  }

  get isArray() {
    return false
  }

  get isString() {
    return false
  }

  get isNumber() {
    return false
  }

  get isValue() {
    return false
  }

  get isNonexistent() {
    return false
  }
}

export class ObjectNodeType extends NodeType {
  get baseType() {
    return 'object'
  }

  get isObject() {
    return true
  }
}

export class ArrayNodeType extends NodeType {
  get baseType() {
    return 'array'
  }

  get isArray() {
    return true
  }
}

export class StringNodeType extends NodeType {
  get baseType() {
    return 'string'
  }

  get isString() {
    return true
  }
}

export class NumberNodeType extends NodeType {
  get baseType() {
    return 'number'
  }

  get isNumber() {
    return true
  }
}

export class ValueNodeType extends NodeType {
  get baseType() {
    return 'value'
  }

  // boolean, null
  get isValue() {
    return true
  }
}

export class NonexistentNodeType extends NodeType {
  get baseType() {
    return null
  }

  get isNonexistent() {
    return true
  }
}

export const nodeTypes = {
  object: new ObjectNodeType(),
  array: new ArrayNodeType(),
  string: new StringNodeType(),
  number: new NumberNodeType(),
  value: new ValueNodeType(),
  nonexistent: new NonexistentNodeType(),
}
