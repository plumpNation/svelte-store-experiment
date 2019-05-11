import App from './App.svelte';
import { writable } from 'svelte/store';
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
// /////////////////////////////////////////////////////////////////////////////

// Create a simple svelte store with a single object as the first element
export const things = writable([
	{
		foo: 'bar'
	}
]);

// We need to take a reference of the store contents on each fire of subscribe
// so we can check it's equality.
let prevValuesZero;

// So the subscribe becomes the test
things.subscribe(values => {
	console.log('`things` subscribe fired');

	if (prevValuesZero && values[0] === prevValuesZero) {
		console.log('NOT IMMUTABLE', values[0].nameNotImportant);
	}

	prevValuesZero = values[0];
});

// Just using the svelte update, the store contents is not immutable
setTimeout(() => {
	things.update(values => {
		values[0].nameNotImportant = 'svelte update';

		return values;
	});
}, 500);

// By utilising immer, we can add that functionality in a very simple way
setTimeout(() => {
	things.update(produce(draft => {
		draft[0].nameNotImportant = 'immer update';
	}));
}, 1000);
