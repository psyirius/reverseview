import {Component} from "preact";

interface Props {
    min?: number;
    max?: number;
    value?: number;
    onChange?: (value: number) => void;
    step?: number;
    size?: string;
}

interface State {
    value: number;
    isDragging: boolean;
    startX: number;
    startValue: number;
}

class Slider extends Component<Props, State> {
    sliderRef: HTMLElement | null;

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value || (props.min || 0),
            isDragging: false,
            startX:0,
            startValue:0,
        };
        this.sliderRef = null;
    }
    componentDidUpdate(prevProps:Props){
        if(this.props.value!==prevProps.value) {
            this.setState({value: this.props.value || (this.props.min || 0)})
        }
    }

    calculateSteppedValue = (value: number) => {
        if(this.props.step) {
            const step = this.props.step;
            const steppedValue = Math.round(value / step) * step;
            return Math.max(this.props.min || 0, Math.min(steppedValue, this.props.max || 100));
        }
        return value;
    }

    handleMouseDown = (event: any) => {
        event.preventDefault() //Prevents text selection
        this.setState({isDragging: true, startX: event.clientX, startValue: this.state.value});
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    };

    handleMouseMove = (event:any) => {
        if(this.state.isDragging && this.sliderRef){
            const sliderRect = this.sliderRef.getBoundingClientRect();
            const offsetX = event.clientX - this.state.startX;
            const percentage = offsetX / sliderRect.width;
            const range = (this.props.max || 100) - (this.props.min || 0);
            let newValue = this.state.startValue + range * percentage;
            const steppedValue =  this.calculateSteppedValue(newValue);
            this.setState({value: steppedValue});
            if(this.props.onChange){
                this.props.onChange(steppedValue);
            }
        }
    }

    handleMouseUp = () => {
        if(this.state.isDragging){
            this.setState({ isDragging: false, startX:0, startValue:0 });
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
        }
    };

    setSliderRef = (element: HTMLElement) => {
        this.sliderRef= element;
    }

    render() {
        const { min = 0, max = 100, size='200px' } = this.props;
        const percentage = (this.state.value - min) / (max - min) * 100;

        return (
            <div class="slider-container" style={{width: size}}>
                <div class="slider"
                     ref={this.setSliderRef}
                     onMouseDown={this.handleMouseDown}
                >
                    <div
                        class="slider-thumb"
                        style={{left:`${percentage}%`}}
                    >
                    </div>
                </div>
            </div>
        );
    }
}

export default Slider;