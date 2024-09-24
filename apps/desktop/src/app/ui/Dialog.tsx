import {Component, ComponentChild, RenderableProps} from "preact";

interface Props {

}

interface State {

}

export default class Dialog extends Component<Props, State> {
    render(props?: RenderableProps<Props, any>, state?: Readonly<State>, context?: any): ComponentChild {
        return (
            <div className="xui dialog">
                HALLO
            </div>
        )
    }
}