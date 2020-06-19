Authenticate into Asana (`/asana` and `https://app.asana.com/`)

```
https://app.asana.com/ :auth <api-token>
```

This stores the API key in `/asana/accounts/default/api-key`

Authenticate with a different account (still `/asana` and `https://app.asana.com/` but with different --acount option):

```
https://app.asana.com/ :auth <api-token> account:acme
```

```
https://app.asana.com/0/1138929626133616/1177203200389571 :close
https://app.asana.com/0/1138929626133616/1177203200389571 :comment "done!"
```

for a task that can only be accessed w/ client-asana api key:

```
https://app.asana.com/0/1138143243423432/1123439392834213323 :close account:acme
```

or with the action first:

```
:comment https://app.asana.com/0/1138929626133616/1177203200389571 "done!"
```
