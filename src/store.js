import { writable } from 'svelte/store';
import produce from 'immer';

const initialState = [
	{
		foo: 'bar'
	}
];

function createThings() {
  const { subscribe, update } = writable(initialState);

  return {
    update, // expose the original svelte update for test purposes
    subscribe,

    // expose an immer based update
    immerProduceUpdate: draftUpdater => update(produce(draftUpdater))
  };
}

export const things = createThings();
