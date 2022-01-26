import Events from "../src";
import type { EventInterface } from "../src";

type EventTypes = "type-1" | "type-2";
type IssuerTypes = "tester";
interface PayLoadInterface {
  name: string;
  address: string;
}

type EventI = EventInterface<EventTypes, PayLoadInterface, IssuerTypes>;

describe("Events", () => {
  let thor: Events<EventTypes, PayLoadInterface, IssuerTypes>;

  const mockCallback1 = jest.fn(() => "function-1 is called");
  const mockCallback2 = jest.fn(() => "function-2 is called");
  const mockCallback3 = jest.fn(() => "function-3 is called");

  const evt1: EventI = {
    id: "id-1",
    type: "type-1",
    issuer: "tester",
    payload: {
      name: "name-1",
      address: "address-1",
    },
  };

  const evt2: EventI = {
    id: "id-2",
    type: "type-1",
    issuer: "tester",
    payload: {
      name: "name-2",
      address: "address-2",
    },
  };

  const evt3: EventI = {
    id: "id-3",
    type: "type-2",
    issuer: "tester",
    payload: {
      name: "name-3",
      address: "address-3",
    },
  };

  const evt4: EventI = {
    id: "id-4",
    type: "type-1",
    issuer: "tester",
    payload: {
      name: "name-4",
      address: "address-4",
    },
  };

  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(1648764000000);

    thor = new Events();
  });

  it("should be defined", () => {
    expect(thor).toMatchSnapshot();
  });

  it("should initialize event with two different types", () => {
    thor.init(evt1);
    thor.init(evt2);
    thor.init(evt3);

    expect(thor).toMatchSnapshot();
  });

  it("should update event-3 payload", () => {
    thor.setPayload({
      id: evt3.id,
      payload: {
        name: "name-updated-3",
        address: "address-updated-3",
      },
    });

    expect(thor).toMatchSnapshot();
  });

  it("should update event-2 id", () => {
    thor.updateID({
      id: evt3.id,
      newID: "id-3-updated",
    });

    expect(thor.idsByType).toMatchObject({
      "type-1": ["id-1", "id-2"],
      "type-2": ["id-3-updated"],
    });
  });

  it("should return all registered events in the same type", () => {
    expect(thor.getEventsByType("type-1")).toMatchObject(["id-1", "id-2"]);
    expect(thor.getEventsByType("type-2")).toMatchObject(["id-3-updated"]);
  });

  it("should clear from registry", () => {
    thor.clear("id-3-updated");
    expect(thor.getEventsByType("type-2")).toMatchObject([]);
    expect(thor.idsByType).toMatchObject({
      "type-1": ["id-1", "id-2"],
    });
  });

  it("should add functions emitter", () => {
    thor.on("type-1", mockCallback1, mockCallback2, mockCallback3);
    expect(thor).toMatchSnapshot();
  });

  it("should emit all registered function by type", () => {
    thor.emit({
      type: "type-1",
    });

    expect(mockCallback1).toHaveBeenCalledTimes(2);
    expect(mockCallback2).toHaveBeenCalledTimes(2);
    expect(mockCallback3).toHaveBeenCalledTimes(2);
  });

  it("should emit all registered function by id", () => {
    thor.emit({
      id: evt1.id,
      type: evt1.type,
      issuer: evt1.issuer,
      payload: evt4.payload,
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
    expect(mockCallback3).toHaveBeenCalledTimes(1);
  });

  it("should emit by type without init", () => {
    thor.emit(evt4);
    thor.on("type-1");

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
    expect(mockCallback3).toHaveBeenCalledTimes(1);
  });

  it("should have the new instances", () => {
    expect(thor).toMatchSnapshot();
  });
});
