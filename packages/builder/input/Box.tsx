import {useState} from "preact/hooks";

export default function Box(props: any) {
    const [value, setValue] = useState("X");

    return (
        <>
            <div
                onMouseOver={() => setValue("OVER")}
                onMouseOut={() => setValue("OUT")}
            >{props?.children}</div>

            <p>{value}</p>
        </>
    );
}