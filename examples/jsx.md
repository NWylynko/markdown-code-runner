react jsx

``` jsx
import React from "react"

const App = () => <p>Example React</p>

export default App
```
<!-- markdown-code-runner image-start -->

![rendered jsx](./jsx.0.png)

<!-- markdown-code-runner image-end -->


``` jsx
import React from "react"

const App = () => {
  return (
  <div>
    <h3>last time this was rendered</h3>
    <p>{Date()}</p>
  </div>
   )
}

export default App
```
<!-- markdown-code-runner image-start -->

![rendered jsx](./jsx.1.png)

<!-- markdown-code-runner image-end -->

