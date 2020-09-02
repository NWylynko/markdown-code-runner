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
```
``` markdown-code-runner
/tmp/4012178/index.js:12
```
   

SyntaxError: Unexpected end of input
    at wrapSafe (internal/modules/cjs/loader.js:1053:16)
    at Module._compile (internal/modules/cjs/loader.js:1101:27)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1157:10)
    at Module.load (internal/modules/cjs/loader.js:985:32)
    at Function.Module._load (internal/modules/cjs/loader.js:878:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)
    at internal/main/run_main_module.js:17:47

```
 markdown-code-runner
the javascript code is run in node
it can do maths
6500.7887627037335
and can render a table
┌─────────┬──────────┬───────┐
│ (index) │   name   │ yummy │
├─────────┼──────────┼───────┤
│    0    │ 'chips'  │   6   │
│    1    │ 'pizza'  │   4   │
│    2    │ 'burger' │   5   │
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

