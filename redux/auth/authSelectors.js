export const selectorStateChange = (state) => Boolean(state.auth.stateChange);
export const selectorUserId = (state) => state.auth.userId;
export const selectorName = (state) => state.auth.name;
export const selectorPhoto = (state) => state.auth.photo;
