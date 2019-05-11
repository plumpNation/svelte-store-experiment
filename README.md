Svelte store test
=================

Project built using https://github.com/sveltejs/template.

Experiment to figure out immutability in the Svelte 3 stores.

SPOILER: Either I misunderstood svelte, or it doesn't provide immutability out
of the box. So I used Immer, which I recommend highly.

NOTE: this code is meant as an overview, and may have typos, or require you to
actually read the working source.

## Running the examples

```shell
# install the deps
yarn

# start the server
yarn dev
```

## The basics

```js
import produce from 'immer';
import { writable, get } from 'svelte/store';

const things = writable([{foo: 'bar'}]);

// standard svelte `update`
things.update(values => {
  values[0].nameNotImportant = 'svelte update';

  // const existingValues = get(things); // <-- has already been mutated

  return values;
});

// immer `produce`, with standard svelte `update`
things.update(produce(draft => {
  draft[0].nameNotImportant = 'immer update';
}));
```

## Abstracting the immutable update away

If we overwrite the svelte store `update` function by creating a custom store,
we can provide an immutable update via Immer's `produce`. This keeps it abstracted
away from the developers and ensures that all updates are immutable.

```js
import { writable } from 'svelte/store';

const initialState = [{
  foo: 'bar'
}];

function createThings() {
  const { update } = writable(initialState);

  return {
    update: fn => update(produce(fn)),
  };
}

const things = createThings();

things.update(draft => {
  draft[0].nameNotImportant = 'immer inside store update';
});
```

