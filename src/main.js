import App from './App.svelte';
import { things } from './store';
import { get } from 'svelte/store';
import produce from 'immer';

const app = new App({
	target: document.body,
	props: {
		name: 'jeff'
	}
});

export default app;

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////

// We need to take a reference of the store contents on each fire of subscribe
// so we can check it's equality.
let prevValuesZero;

// So the `subscribe` becomes the place to test if the store value is changed
things.subscribe(values => {
	let message = 'IMMUTABLE';

	console.log('`things` subscribe fired');

	if (prevValuesZero && values[0] === prevValuesZero) {
		message = `NOT ${message}`; // NOT IMMUTABLE
	}

	console.log(message, values[0].nameNotImportant);

	prevValuesZero = values[0];
});

// Just using the svelte update, the store contents is not immutable
setTimeout(() => {
	things.update(values => {
		// mutate store data
		values[0].nameNotImportant = 'svelte update';

		// immediately check the store value again
		const existingStoreValues = get(things);

		if (existingStoreValues[0].nameNotImportant === 'svelte update') {
			// this will happen
			console.warn('store mutated in an update before `set` called');
		}

		return values;
	});
}, 500);

// By utilising immer, we can add that functionality in a very simple way
setTimeout(() => {
	things.update(produce(draft => {
		draft[0].nameNotImportant = 'immer update';
	}));
}, 1000);

// If we add the immer functionality inside our stores, developers do not have
// to think about this when updating.
setTimeout(() => {
	things.immerUpdate(draft => {
		draft[0].nameNotImportant = 'immer inside store update';
	});
}, 1500);
