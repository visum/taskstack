export class Observer<T> {
  handler: null | ((newValue: T) => void);
  context: ObservableValue<T>;

  constructor(handler: (newValue: T) => void, context: ObservableValue<T>) {
    this.handler = handler;
    this.context = context;
  }

  notify(newValue: T) {
    if (this.handler) {
      this.handler(newValue);
    }
  }

  dispose() {
    this.handler = null;
    this.context.unsubscribe(this);
  }
}

export class ObservableValue<T> {
  private _value: T;
  private _observers: Observer<T>[] = [];

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  onChange(handler: (newValue: T) => void): Observer<T> {
    const observer = new Observer(handler, this);
    this._observers.push(observer);
    return observer;
  }

  unsubscribe(observer: Observer<T>) {
    const observerIndex = this._observers.indexOf(observer);
    if (observerIndex > -1) {
      this._observers.splice(observerIndex, 1);
    }
  }

  dispose() {
    this._observers.forEach((observer) => {
      observer.dispose();
    });
  }

  getValue() {
    return this._value;
  }

  setValue(newValue: T) {
    this._value = newValue;
    this._observers.forEach((observer) => {
      observer.notify(newValue);
    });
  }
}
