import {render} from "preact";
import {useState} from "preact/hooks";
import Box from "./Box";
import * as s from "./styles.module.scss";

const Main = () => {
    const [value, setValue] = useState("X");

    return (
        <>
            <h1 class={s.Mx}>XOOO</h1>
            <button onClick={() => setValue("XXX")}>X</button>
            <button onClick={() => setValue("OOO")}>O</button>

            <Box>
                <p>Hello World 1</p>
                <p>Hello World 2</p>
                <p>{value}</p>
                <p>Hello World 4</p>
                <p>Hello World 5</p>
            </Box>
        </>
    );
};

const x = [1, 2, 3, 4, 5];
for (const x1 of x) {
    console.log(x1);
}

render(Main, document.body);

export default Main;
