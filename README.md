# markdown-code-runner
github action to run code in a markdown file and append the output to the markdown file

Javascript
``` js
console.log('hello world from javascript')
```

``` markdown-code-runner output
hello world from javascript
```

Typescript
``` ts
console.log('hello world from typescript')
```

``` markdown-code-runner output

> 61827838@1.0.0 start /tmp/61827838
> ts-node index.ts

hello world from typescript
```

JSX
``` jsx
import React from "react"

const App = () => <p>hello world from jsx</p>

export default App
```

<!-- markdown-code-runner image-start -->

![rendered jsx](./README.4.png)

<!-- markdown-code-runner image-end -->

Python
``` py
print('hello world from python')
```

``` markdown-code-runner output
hello world from python
```

Bash
``` bash
echo 'hello world from bash'
```

``` markdown-code-runner output
hello world from bash
```

Shell
``` sh
echo 'hello world from Shell'
```

``` markdown-code-runner output
hello world from Shell
```
