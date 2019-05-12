import App from './App.svelte';
import { things } from './store';
import { get } from 'svelte/store';
import produce from 'immer';

const app = new App({
  target: document.body,
  props: {
    name: 'Jeff'
  }
});

export default app;

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////

// We need to take a reference of the store contents on each fire of subscribe
// so we can check it's equality.
let prevValues;

// So the `subscribe` becomes the place to test if the store value is changed
things.subscribe(values => {
  if (!prevValues) {
    console.log('store initialised');

  } else {
    testMutation(prevValues, values);

    console.log('Test finished for', values[0].updateType);
  }

  prevValues = values;
});

// Just using the svelte update, the store contents is not immutable
things.update(values => {
	// Just to illustrate that the reference update happens check the current store value:
	const existingStoreValues = get(things);

	console.assert(
    existingStoreValues[0].updateType === values[0].updateType,
    'values should be identical at this point', values[0].updateType
  );

  // mutate store data
  values[0].updateType = 'svelte only';

  // Ideally, values should be different at this point.
  console.assert(
    existingStoreValues[0].updateType !== values[0].updateType,
    'store mutated instantly within the update function by', values[0].updateType
  );

  return values;
});

// By utilising immer, we can add that functionality in a very simple way
things.update(produce(draft => {
  draft[0].updateType = 'svelte with immer';
}));

// If we add the immer functionality inside our stores, developers do not have
// to think about this when updating.
things.immerProduceUpdate(draft => {
  draft[0].updateType = 'immer inside svelte store';

  // NOTE: we don't need to `return`, because internally it's `immer.produce`.
  // This could be a source of confusion for devs, but it won't break anything
  // if they do return the draft.
});

function testMutation(prev, current) {
  console.assert(
    current !== prev,
    'array has been mutated by', current[0].updateType
  );

  console.assert(
    current[0] !== prev[0],
    'array[0] has been mutated by', current[0].updateType
  );
}
