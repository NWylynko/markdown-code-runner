## javascript

``` js
console.log("the javascript code is run in node");
console.log("it can do maths");
console.log(7 * 30 * Math.random() * 100);
console.log("and can render a table");
const score = () => Math.floor(Math.random() * 10);
const table = [
  { name: "chips", yummy: score() },
  { name: "pizza", yummy: score() },
  { name: "burger", yummy: score() },
];
console.table(table);
```

``` markdown-code-runner
the javascript code is run in node
it can do maths
20171.017361767575
and can render a table
┌─────────┬──────────┬───────┐
│ (index) │   name   │ yummy │
├─────────┼──────────┼───────┤
│    0    │ 'chips'  │   2   │
│    1    │ 'pizza'  │   5   │
│    2    │ 'burger' │   3   │
└─────────┴──────────┴───────┘

```

``` js
const fetch = require("node-fetch");

console.log('Kanye West quote:')

fetch('https://api.kanye.rest/')
  .then(res => res.json())
  .then(body => body.quote)
  .then(console.log)
  .catch(console.error)
```

<!-- markdown-code-runner
  {
    "dependencies": [
      "node-fetch"
    ]
  }
-->

``` markdown-code-runner
Kanye West quote:
I think I do myself a disservice by comparing myself to Steve Jobs and Walt Disney and human beings that we've seen before. It should be more like Willy Wonka...and welcome to my chocolate factory.

```
