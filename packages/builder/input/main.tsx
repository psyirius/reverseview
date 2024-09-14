import {render, h} from "preact";
import { block } from 'million/react';
import Box from "./box";

const Main = () => (
    <>
        <Box>
            <p>Hello World 1</p>
            <p>Hello World 2</p>
            <p>Hello World 3</p>
            <p>Hello World 4</p>
            <p>Hello World 5</p>
        </Box>
    </>
);

render(block(Main), document.body);

