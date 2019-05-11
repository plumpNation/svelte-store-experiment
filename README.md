Svelte store test
=================

Quick experiment to check support for immutability in the Svelte 3 stores.

SPOILER: Either I misunderstood svelte, or it doesn't provide immutability out
of the box. So I had to use Immer, which I recommend.

Look in main.js for the full code.

```js
import produce from 'immer';
import { writable } from 'svelte/store';

const things = writable([{foo: 'bar'}]);

// svelte only way
things.update(values => {
  values[0].nameNotImportant = 'svelte update';

  return values;
});

// immer way
things.update(produce(draft => {
  draft[0].nameNotImportant = 'immer update';
}));
```
