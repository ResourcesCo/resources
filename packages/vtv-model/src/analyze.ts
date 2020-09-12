import j2ref from "j2ref";
import { isObject } from "lodash";

export function getNodeType(value) {
  if (isObject(value)) {
    return "object";
  } else if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "string") {
    return "string";
  } else if (typeof value === "number") {
    return "number";
  } else {
    return "value";
  }
}

export function getStringType(value) {
  if (value.length >= 256 || value.indexOf("\n") !== -1) {
    return "text";
  } else {
    return "inline";
  }
}

export function getMediaType(value) {
  try {
    const match = /^data:([^,.;]+)[,.;]/.exec(value.substr(0, 60));
    const result = match[1];
    return result;
  } catch {
    return undefined;
  }
}

export function getNodeInfo(value, state) {
  let isExpandable = hasChildren(value);
  const nodeType = getNodeType(value);
  let stringType = null;
  let mediaType = null;
  if (nodeType === "string") {
    stringType = getStringType(value);
    isExpandable =
      stringType !== "inline" ||
      ["text", "code", "image"].includes(state._view);
    if (isExpandable) {
      mediaType =
        typeof state._mediaType === "string"
          ? state._mediaType
          : getMediaType(value);
    }
  }
  return {
    isExpandable,
    stringType,
    nodeType,
    mediaType,
  };
}

export const getPaths = (item, depth = 2) => {
  let result = [];
  if (isObject(item)) {
    for (let key of Object.keys(item)) {
      if (isObject(item[key])) {
        if (depth > 0) {
          result = result.concat(
            getPaths(item[key], depth - 1).map((result) => [key, ...result])
          );
        }
      } else if (!Array.isArray(item[key])) {
        result.push([key]);
      }
    }
  } else {
    result.push([]);
  }
  return result;
};

export const getCollectionPaths = (collection) => {
  const paths = {};
  const values = Array.isArray(collection)
    ? collection
    : Object.keys(collection).map((key) => collection[key]);
  for (let item of values) {
    for (let path of getPaths(item)) {
      const str = JSON.stringify(path);
      paths[str] = paths[str] || 0;
      paths[str] += 1;
    }
  }
  return Object.keys(paths).map((path) => JSON.parse(path));
};

export const isUrl = (str) => {
  return /^https?:\/\//.test(str);
};

export const hasChildren = (value) => {
  if (isObject(value)) {
    return Object.keys(value).length > 0;
  } else if (Array.isArray(value)) {
    return value.length > 0;
  } else {
    return false;
  }
};

export const getAtPath = (value, path) => {
  if (path.length === 0) {
    return value;
  } else {
    const [key, ...rest] = path;
    if (typeof value === "object" && value !== null) {
      return getAtPath(value[key], rest);
    }
  }
};

export const isIdentifier = (s) => {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s);
};

export const joinPath = (path) => {
  let result = "";
  for (let i = 0; i < path.length; i++) {
    if (isIdentifier(path[i])) {
      result += (i === 0 ? "" : ".") + path[i];
    } else {
      result += `[${JSON.stringify(path[i])}]`;
    }
  }
  return result;
};

export function splitPath(str) {
  if (str.indexOf("://") !== -1) {
    return;
  }
  if (str[0] === "[") {
    const result = j2ref(`$${str}`);
    if (result && result.keys) {
      return result.keys.slice(1);
    }
  } else {
    const result = j2ref(str);
    if (result) {
      return result.keys;
    }
  }
}
