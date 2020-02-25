import {cleanup} from '@testing-library/react';
import promise from 'promise';

global.Promise = promise;

afterEach(cleanup);