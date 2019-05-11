import { writable } from 'svelte/store';
import produce from 'immer';

const initialState = [
  {
    foo: 'bar'
  }
];

/**
 * By creating a custom store, we can expose our own update function and abstract
 * the immutability away from the developer.
 */
function createThings() {
  const { subscribe, update } = writable(initialState);

  return {
    update, // expose the original svelte update (for test purposes)
    subscribe,

    // expose an immer based update
    immerProduceUpdate: draftUpdater => update(produce(draftUpdater))
  };
}

export const things = createThings();
