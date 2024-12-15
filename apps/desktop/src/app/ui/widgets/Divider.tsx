export type DividerProps = {
    orientation?: 'horizontal' | 'vertical';
    hidden?: boolean;
}

export default function Divider({ orientation, hidden } : DividerProps) {
    orientation ??= 'horizontal';

    const classes = [
        'ui',
        'divider',
        orientation,
    ]

    if (hidden) {
        classes.push('hidden');
    }

    return (
        <div class={classes.join(' ')}></div>
    )
}