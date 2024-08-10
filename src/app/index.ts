class App {
    constructor() {
        air.trace('Hello, world!');
    }

    public sayHello() {
        air.trace('Hello, world!');
    }
}

window.onload = () => {
    new App().sayHello();
}