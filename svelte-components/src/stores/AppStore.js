import { writable, derived } from 'svelte/store';

export const spots = writable({});
export const modal = writable(null);
export const visualMode = writable('color');
export const page = writable(1);
export const nbPerPage = writable(5);
export const nbPages = derived([spots, nbPerPage], ([$spots, $nbPerPage]) => {
  return Math.ceil($spots.length / $nbPerPage);
})
export const nbSpots = derived([spots], ([$spots]) => {
  return $spots.length;
})