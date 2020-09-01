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

``` markdown-code-runner output
the javascript code is run in node
it can do maths
15567.885419203742
and can render a table
┌─────────┬──────────┬───────┐
│ (index) │   name   │ yummy │
├─────────┼──────────┼───────┤
│    0    │ 'chips'  │   8   │
│    1    │ 'pizza'  │   8   │
│    2    │ 'burger' │   6   │
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

``` markdown-code-runner output
Kanye West quote:
My greatest award is what I'm about to do.
```
