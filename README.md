# Thor Event Emitter

> Event emitter to manage your state.

An event emitter that allows you to manage your global state. Instead of using
global giant object to store your shared sate, you can simply emit the events
you need with the necessary payload and keep your state managed locally.

```bash
npm install thor-event
```

Somewhere in your code:

```typescript
import ThorEvent from "thor-event";

const appEvent = new ThorEvent();

appEvent.emit({
  id: "evt-1",
  type: "auth",
  issuer: "api.auth.com",
  type: "auth", // notify all listeners of this type
  payload: {
    name: "name",
    address: "address-1",
  },
});
```

And inside you React JSX component

```tsx
const handleUserAuth = ({payload, ...rest}: UserInfo) => {
  // update my state locally
  setUserInfo({...payload)};

  // do something else with the rest
};

React.useEffect(() => {
  appEvent.on("auth", handleUserAuth);

  return () => {
    appEvent.off("auth", handleUserAuth);
  };
}, []);

return (
  <div>
    <p>userInfo</p>
  </div>
);
```

## API

Initialize the event emitter (optional):

```ts
init(evt: EventInterface<EventTypes, PayLoadInterface, IssuerTypes>)
```

The evt object contains:

- `id?: string`,
- `type?: EventTypes | string`,
- `issuer?: IssuerTypes | string`,
- `payload?: PayLoadInterface | any`,

Update the payload of an event:

```ts
setPayload(evt: EventInterface<EventTypes, PayLoadInterface, IssuerTypes>)
```

Update the id of an event:

```ts
updateID({ id, newID });
```

- `id: string`,
- `newID: string`,

To get all events from the same type:

```ts
getEventsByType(type?: EventTypes | string) : EventInterface[]
```

Bind an event listener to an event type:

```ts
on(type: EventTypes | string, listeners: (evt: EventInterface<EventTypes, PayLoadInterface, IssuerTypes>) => void)
```

Emit an event:

```ts
emit(evt: EventInterface<EventTypes, PayLoadInterface, IssuerTypes>)
```

To clear event and its binding listeners:

```ts
clear(id:string)
```

Unbind an event listener:

```ts
off(type: EventTypes | string, listeners: (evt: EventInterface<EventTypes, PayLoadInterface, IssuerTypes>) => void)
```

## Test

```sh
npm test
```

## License

This project is licensed under the [MIT](https://github.com/jalal246/thor-event/blob/main/LICENSE)
