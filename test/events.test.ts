import Events from "../src";

type EventTypes = "test1" | "test2";

interface PayLoadInterface {
  name: string;
  address: string;
}

describe("Events", () => {
  let event: Events<EventTypes, PayLoadInterface>;

  beforeAll(() => {
    event = new Events();
  });

  it("should be defined", () => {
    expect(event).toMatchInlineSnapshot(`
      Events {
        "emitter": Emitter {
          "listeners": Object {},
        },
        "events": Object {},
        "idsByType": Object {},
      }
    `);
  });

  it("should add event", () => {});
});
