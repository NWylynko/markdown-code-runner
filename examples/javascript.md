
## javascript

``` js
console.log('the javascript code is run in node')
console.log('it can do maths')
console.log(7 * 30 * Math.random() * 100)
console.log('and can render a table')
const score = () => Math.floor(Math.random() * 100)
const table = [
    {name: "chips", yummy: score()},
    {name: "pizza", yummy: score()},
    {name: "burger", yummy: score()}
]
console.table(table)
```

``` markdown-code-runner output
the javascript code is run in node
it can do maths
13491.224511113387
and can render a table
┌─────────┬──────────┬───────┐
│ (index) │   name   │ yummy │
├─────────┼──────────┼───────┤
│    0    │ 'tomato' │   3   │
│    1    │ 'pizza'  │   7   │
│    2    │ 'burger' │   9   │
└─────────┴──────────┴───────┘
```
