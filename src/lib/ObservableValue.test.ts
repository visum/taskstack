import { ObservableValue } from "./ObservableValue";

describe("ObservableValue", () => {
  test("constructs", () => {
    const ov = new ObservableValue<string>("");
    expect(ov).toBeDefined();
  });

  test("setValue", () => {
    const ov = new ObservableValue<string>("");
    expect(ov.getValue()).toBe("");
    ov.setValue("new");
    expect(ov.getValue()).toBe("new");
  });

  test("observes", () => {
    const ov = new ObservableValue<string>("");

    const promise = new Promise<void>((resolve) => {
      ov.onChange(newValue => {
        expect(newValue).toBe("new");
        resolve();
      });
    });

    ov.setValue("new")

    return promise;
  });
});