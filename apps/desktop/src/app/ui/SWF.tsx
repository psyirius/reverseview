interface Props {
    src: string;
}

export default function SWF({ src }: Props) {
    return (
        <script type="application/x-shockwave-flash" src={src}></script>
    );
}