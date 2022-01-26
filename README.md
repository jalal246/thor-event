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
import { EventEmitter } from "thor-event";

const appEvent = new EventEmitter();

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

## Test

```sh
npm test
```

## License

This project is licensed under the [MIT](https://github.com/jalal246/thor-event/blob/main/LICENSE)
