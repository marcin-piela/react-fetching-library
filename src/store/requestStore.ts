import { Action } from '../client/client.types'
import { convertActionToBase64 } from '../utils';

class RequestStore {
    value: Record<string, Promise<any> | undefined> = {};

    add = (action: Action, request: Promise<any>, options?: { removeTimeout: number, removeOnError: boolean }) => {
        this.value[convertActionToBase64(action)] = request;

        if (options?.removeTimeout) {
            request.then(() => {
                setTimeout(() => this.remove(action), options.removeTimeout);
            })
        }

        if (options?.removeOnError) {
            request.catch(() => this.remove(action));
        }
    }

    remove = (action: Action) => {
        const key = convertActionToBase64(action);

        if (this.value[key]) {
            delete this.value[key];
        }
    }

    get = (action: Action) => {
        return this.value[convertActionToBase64(action)]
    }

    has = (action: Action) => {
        return Boolean(this.value[convertActionToBase64(action)]);
    }
};

export default new RequestStore();