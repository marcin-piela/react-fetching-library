type Observer = { resourceName: string; action: Action; callback: (action: Action, data: any) => void };

type Action = {
  type: ActionType;
  strategy?: UpdateStrategy;
};

type ActionType = 'refresh' | 'update';
type UpdateStrategy = 'replace' | 'add-start' | 'add-end';

export const Observable = () => {
  const subscribers: Observer[] = [];

  return {
    subscribe: (resourceName: string, action: Action, callback: (action: Action, data: any) => void) => {
      const subscriber = {
        resourceName,
        action,
        callback,
      };

      subscribers.push(subscriber);

      return () => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      };
    },
    publish: (resourceName: string, action: Action, data?: any) => {
      subscribers.forEach(subscriber => {
        if (subscriber.resourceName === resourceName && subscriber.action.type === action.type) {
          subscriber.callback(action, data);
        }
      });
    },
  };
};
