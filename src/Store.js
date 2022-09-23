import { legacy_createStore } from 'redux';

import Reducers from './reducers/index';

const store = legacy_createStore(Reducers);

export default store;