# Original

The value is the JSON document and the state contains the properties for any node in
the document.

- Properties and nested property sets share a namespace, with records starting with `_`
  being properties, except ones starting with `__` which match the keys with one `_`
  removed. For instance, if I have this JSON document as the value:

``` json
{
  "name": "test",
  "location": {
    "city": "Denver",
    "state": "CO"
  },
  "_id": 324323
}
```

In order for `_id` and `state` to be checked, for example, the state would be:

``` json
{
  "__id": {
    "_checked": true
  },
  "city": {
    "state": {
      "checked": true
    }
  }
}
```

For things that apply to multiple nodes, there is a separate rule system that
takes in path-to-regexp paths. For instance, to link each node to a URL, there
would be a rule:

``` json
{
  "path": "/location/:field",
  "link": "http://example.com/"
}
```

# New (proposed)

The original format has the drawback that defining the type in TypeScript
is complicated. Another is prefixing lots of values with `_`. Finally the
system for path-to-regexp rules is different.

To address this, putting the child elements into a separate key would make
the type simpler.

The key for this in React is children. For this I'm considering using `_`
because it's much shorter and works both in URLs and JavaScript without
excaping. It is sort of the reverse of what `-`, which is similar,
normally means but it isn't a reserved name.

With this as the value:

``` json
{
  "name": "test",
  "location": {
    "city": "Denver",
    "state": "CO"
  },
  "_id": 324323
}
```

In order for `_id` and `state` to be checked, for example, the state would be:

``` json
{
  "_id": {
    "checked": true
  },
  "location": {
    "_": {
      "state": {
        "checked": true
      }
    }
  }
}
```

The rules could also be differentiated by if they start with a `/`. This
may have the same problem as differentiating fields starting with an
underscore. Perhaps adding them under a different key like `rules` would
be better. Here it is differentiated with a `/`:

``` json
{
  "_id": {
    "checked": true
  },
  "location": {
    "_": {
      "/:field": {
        "link": "http://example.com/"
      },
      "state": {
        "checked": true
      }
    }
  }
}
```

Here it is using a separate `rules` key:

``` json
{
  "_id": {
    "checked": true
  },
  "location": {
    "_": {
      "state": {
        "checked": true
      }
    },
    "rules": {
      "/:field": {
        "link": "http://example.com/"
      }
    }
  }
}
```