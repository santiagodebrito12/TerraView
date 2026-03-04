// Module-level image store — persists for the duration of the browser session.
// Keyed by asset id, values are the image file objects with blob URL previews.
const store = {};

export const storeImages = (id, sections) => { store[id] = sections; };
export const getImages = (id) => store[id] || null;
