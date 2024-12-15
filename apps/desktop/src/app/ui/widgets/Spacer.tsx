export type SpacerProps = {
    orientation?: 'horizontal' | 'vertical';
}

export default function Spacer({ orientation } : SpacerProps) {
    orientation ??= 'horizontal';

    return (
        <div class={`ui ${orientation} divider`}></div>
    )
}