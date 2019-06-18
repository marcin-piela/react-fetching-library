import promise from 'promise';
import {cleanup} from '@testing-library/react';

global.Promise = promise;

afterEach(cleanup);