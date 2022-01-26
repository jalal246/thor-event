import Events from "../src";

type EventTypes = "test1" | "test2";

type IssuerTypes = "tester";

interface PayLoadInterface {
  name: string;
  address: string;
}

describe("Events", () => {
  let event: Events<EventTypes, PayLoadInterface, IssuerTypes>;
  const mockCallback1 = jest.fn(() => "function-1 is called");
  const mockCallback2 = jest.fn(() => "function-2 is called");
  const mockCallback3 = jest.fn(() => "function-3 is called");

  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2022, 3, 1));

    event = new Events();
  });

  it("should be defined", () => {
    expect(event).toMatchSnapshot();
  });

  it("should initialize event with two different types", () => {
    event.init({
      id: "id-1",
      type: "test1",
      issuer: "tester",
      payload: {
        name: "name-1",
        address: "address-1",
      },
    });

    event.init({
      id: "id-2",
      type: "test2",
      issuer: "tester",
      payload: {
        name: "name-2",
        address: "address-2",
      },
    });

    expect(event).toMatchSnapshot();
  });

  it("should update event payload", () => {
    event.setPayload({
      id: "id-1",
      type: "test1",
      payload: {
        name: "name-1-updated",
        address: "address-1-updated",
      },
    });

    expect(event).toMatchSnapshot();
  });

  it("should update event-id", () => {
    event.updateID({
      id: "id-1",
      newID: "id-1-updated",
    });

    expect(event.idsByType).toMatchObject({
      test1: ["id-1-updated"],
      test2: ["id-2"],
    });
  });

  it("should return all registered events in the same type", () => {
    expect(event.getEventsByType("test1")).toMatchObject(["id-1-updated"]);
  });

  it("should clear from registry", () => {
    event.clear("id-1-updated");
    expect(event.getEventsByType("test1")).toMatchObject([]);
    expect(event.idsByType).toMatchObject({
      test2: ["id-2"],
    });
    expect(event).toMatchSnapshot();
  });

  it("should add function emitter", () => {
    event.on("test1", mockCallback1, mockCallback2, mockCallback3);
    expect(event).toMatchSnapshot();
  });

  it("should emit function ", () => {
    event.emit({});
    expect(event).toMatchSnapshot();
  });
});
