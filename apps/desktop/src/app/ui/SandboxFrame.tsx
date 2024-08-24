interface Props {
    src: string;
    sandboxRoot: string;
    documentRoot: string;
    visible?: boolean;
    allowCrossDomainXHR?: boolean;
    [key: string]: any;
}

export default function SandboxFrame({ src, visible, ...rest }: Props) {
    const style = {
        display: visible ? 'block' : 'none',
        width: visible ? '100%' : '0',
        height: visible ? '100%' : '0',
    };

    return (
        <iframe
            src={src}
            style={style}
            {...rest}
        ></iframe>
    );
}