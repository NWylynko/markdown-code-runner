
## javascript

``` js
console.log('the javascript code is run in node')
console.log('it can do maths')
console.log(7 * 30 * Math.random() * 100)
console.log('and can render a table')
const table = [
    {name: "tomato", yummy: 4},
    {name: "pizza", yummy: 7},
    {name: "burger", yummy: 9}
]
console.table(table)
```

``` markdown-code-runner output
the javascript code is run in node
it can do maths
5867.8652611897505
and can render a table
┌─────────┬──────────┬───────┐
│ (index) │   name   │ yummy │
├─────────┼──────────┼───────┤
│    0    │ 'tomato' │   4   │
│    1    │ 'pizza'  │   7   │
│    2    │ 'burger' │   9   │
└─────────┴──────────┴───────┘
```
