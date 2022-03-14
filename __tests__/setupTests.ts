import {cleanup} from '@testing-library/react';
import promise from 'promise';

global.Promise = <any>promise;

afterEach(cleanup);