import {Component, ComponentChildren, createRef, JSX} from "preact";
import {console} from "@/platform/adapters/air";
import {useRef, useState} from "preact/hooks";
import ScrollableSelect from "@app/ui/widgets/ScrollableSelect";
import SelectDropdown from "@app/ui/widgets/SelectDropdown";

function GridComponent() {
    interface GridItem {
        id: number;
        title: string;
        subtitle: string;
    }

    const gridItems: GridItem[] = [
        { id: 1, title: 'ஆதிபன் பிறந்தார் - அமலாதிபன் பிறந்தார்', subtitle: '-1' },
        { id: 2, title: 'அன்பான பரனே! - அருள் மேவுங் காரணனே!-நவ அச்சய சச்சித ரட்சகனாகிய உச்சிதவரனே! - ஆ! அம்பர', subtitle: '-2' },
        { id: 3, title: 'ஆதம் பவமற - நீதம் நிறைவேற- அன்று அல்லிராவினில் தொல்லையிடையினில் புல்லணையிற் பிறந்தார். - ஆ! அம்பர', subtitle: '-3' },
        { id: 4, title: 'ஞானியர் தேட-வானவர் பாட -மிக நன்னய, உன்னதபன்னரும் ஏசையா இந்நிலம் பிறந்தார் —ஆ! அம்பர', subtitle: '-4' },
        { id: 5, title: 'கோனவர் நாட-தானவா கொண்டாட - என்று கோத்திரர் தோத்திரஞ் சாற்றிட வே யூத கோத்திரன் பிறந்தார் -ஆ! அம்பர', subtitle: '-5' },
        { id: 6, title: 'விண்ணுடு தோண- மன்னவர் பேண - ஏரோது மைந்தனின் சிந்தையழுந்திக் கலங்கிட விந்தையாய்ப் பிறந்தார் — ஆ! அம்பர', subtitle: '-6' },
        { id: 7, title: 'ஆ! அம்பர உம்பரமும் புகழுந்திரு ஆதிபன் பிறந்தார்', subtitle: '-7' }
    ];

    return (
        <div className="grid">
            {gridItems.map(item => (
                <div key={item.id} className="grid-item">
                    <div>
                        <p>{item.title}</p>
                        <span>{item.id} {item.subtitle}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// interface Item {
//     id: number;
//     text: string;
// }
//
// interface Props {
//     items: Item[];
//     onItemSelected: (itemId: number) => void;
// }
//
// interface State {
//     selectedItemId: number | null;
// }
//
// class ScrollableList extends Component<Props, State> {
//     state: State = {
//         selectedItemId: null,
//     };
//
//     listRef = createRef<HTMLDivElement>();
//     scrollContainerRef = createRef<HTMLDivElement>();
//
//
//     handleItemClick = (itemId: number) => {
//         this.setState({ selectedItemId: itemId });
//         this.props.onItemSelected(itemId);
//     };
//
//     componentDidMount() {
//         if (this.scrollContainerRef.current) {
//             this.scrollContainerRef.current.scrollTop = 0;
//         }
//     }
//     render() {
//         const { items } = this.props;
//         const { selectedItemId } = this.state;
//
//         return (
//             <div className="scrollable-list-container" ref={this.scrollContainerRef}>
//                 <div className="scrollable-list" ref={this.listRef}>
//                     {items.map((item) => (
//                         <div
//                             key={item.id}
//                             className={`list-item ${selectedItemId === item.id ? 'selected' : ''}`}
//                             onClick={() => this.handleItemClick(item.id)}
//                         >
//                             {item.text}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }
// }
//
// function ScrollableComponent() {
//     const items: Item[] = [
//         { id: 1, text: 'Item 1' },
//         { id: 2, text: 'Item 2' },
//         { id: 3, text: 'Item 3' },
//         { id: 4, text: 'Item 4' },
//         { id: 5, text: 'Item 5' },
//         { id: 6, text: 'Item 6' },
//         { id: 7, text: 'Item 7' },
//         { id: 8, text: 'Item 8' },
//         { id: 9, text: 'Item 9' },
//         { id: 10, text: 'Item 10' },
//         { id: 11, text: 'Item 11' },
//         { id: 12, text: 'Item 12' },
//         { id: 13, text: 'Item 13' },
//         { id: 14, text: 'Item 14' },
//         { id: 15, text: 'Item 15' },
//         { id: 16, text: 'Item 16' },
//         { id: 17, text: 'Item 17' },
//         { id: 18, text: 'Item 18' },
//         { id: 19, text: 'Item 19' },
//         { id: 20, text: 'Item 20' },
//         { id: 21, text: 'Item 21' },
//         { id: 22, text: 'Item 22' },
//         { id: 23, text: 'Item 23' },
//         { id: 24, text: 'Item 24' },
//     ];
//
//
//     const handleItemSelected = (itemId: number) => {
//         console.log('Selected item ID:', itemId);
//         // Your code to handle the selected item
//     };
//
//     return (
//         <ScrollableList items={items} onItemSelected={handleItemSelected} />
//     );
// }

// function ScrollableComponent() {
//     interface Item {
//         id: number;
//         text: string;
//     }
//
//     type Direction = 'vertical' | 'horizontal';
//
//
//     interface Props {
//         items: Item[];
//         onItemSelected: (itemId: number) => void;
//         direction?: Direction;
//     }
//
//     interface State {
//         selectedItemId: number | null;
//     }
//
//     class ScrollableList extends Component<Props, State> {
//         state: State = {
//             selectedItemId: null,
//         };
//         listRef = createRef<HTMLDivElement>();
//         scrollContainerRef = createRef<HTMLDivElement>();
//
//         handleItemClick = (itemId: number) => {
//             this.setState({ selectedItemId: itemId });
//             this.props.onItemSelected(itemId);
//         };
//         componentDidMount() {
//             if (this.scrollContainerRef.current) {
//                 this.scrollContainerRef.current.scrollTop = 0;
//                 this.scrollContainerRef.current.scrollLeft = 0;
//             }
//         }
//
//         render() {
//             const { items, direction = 'vertical' } = this.props;
//             const { selectedItemId } = this.state;
//
//             return (
//                 <div
//                     className={`scrollable-list-container ${direction}`}
//                     ref={this.scrollContainerRef}
//                 >
//                     <div className="scrollable-list" ref={this.listRef} >
//                         {items.map((item) => (
//                             <div
//                                 key={item.id}
//                                 className={`list-item ${selectedItemId === item.id ? 'selected' : ''}`}
//                                 onClick={() => this.handleItemClick(item.id)}
//                             >
//                                 {item.text}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             );
//         }
//     }
//
//     const items: Item[] = [
//         { id: 1, text: 'Item 1' },
//         { id: 2, text: 'Item 2' },
//         { id: 3, text: 'Item 3' },
//         { id: 4, text: 'Item 4' },
//         { id: 5, text: 'Item 5' },
//         { id: 6, text: 'Item 6' },
//         { id: 7, text: 'Item 7' },
//         { id: 8, text: 'Item 8' },
//         { id: 9, text: 'Item 9' },
//         { id: 10, text: 'Item 10' },
//         { id: 11, text: 'Item 11' },
//         { id: 12, text: 'Item 12' },
//         { id: 13, text: 'Item 13' },
//         { id: 14, text: 'Item 14' },
//         { id: 15, text: 'Item 15' },
//         { id: 16, text: 'Item 16' },
//         { id: 17, text: 'Item 17' },
//         { id: 18, text: 'Item 18' },
//         { id: 19, text: 'Item 19' },
//         { id: 20, text: 'Item 20' },
//         { id: 21, text: 'Item 21' },
//         { id: 22, text: 'Item 22' },
//         { id: 23, text: 'Item 23' },
//         { id: 24, text: 'Item 24' },
//     ];
//
//
//     const handleItemSelected = (itemId: number) => {
//         console.log('Selected item ID:', itemId);
//         // Your code to handle the selected item
//     };
//
//     return <>
//         <ScrollableList
//             items={items}
//             onItemSelected={handleItemSelected}
//             direction="vertical"
//         />
//         <ScrollableList
//             items={items}
//             onItemSelected={handleItemSelected}
//             direction="horizontal"
//         />
//     </>;
// }

function SelectComponent() {
    const items = [];

    for (let i = 0; i < 1000; i++) {
        items.push({ id: i, text: `Item ${i + 1}` });
    }


    const handleItemSelected = (itemId: number) => {
        console.log('Selected item ID:', itemId);
        // Your code to handle the selected item
    };

    return (
        <>
            <SelectDropdown
                items={items}
                onItemSelected={handleItemSelected}
                placeholder="Choose an item"
            />
            <SelectDropdown
                items={items}
                onItemSelected={handleItemSelected}
                placeholder="Choose an item"
                clearable
            />
            <SelectDropdown
                items={items}
                onItemSelected={handleItemSelected}
                placeholder="Choose an item"
                searchable
            />
            <SelectDropdown
                items={items}
                onItemSelected={handleItemSelected}
                placeholder="Choose an item"
                clearable
                searchable
            />
        </>
    )
}

// function ToolTipComponent() {
//     interface Props {
//         children: ComponentChildren;
//         content: string;
//         position?: 'top' | 'bottom' | 'left' | 'right';
//         delay?: number;
//     }
//
//
//     interface State {
//         isVisible: boolean;
//         timeoutId: any | null;
//     }
//
//     class Tooltip extends Component<Props, State> {
//         static defaultProps = {
//             position: 'top',
//             delay: 200
//         }
//         state: State = {
//             isVisible: false,
//             timeoutId: null,
//         };
//
//         tooltipRef = createRef<HTMLSpanElement>();
//         timeoutId:any = null;
//         handleMouseEnter = () => {
//             const {delay} = this.props;
//             this.timeoutId = setTimeout(() => {
//                 this.setState({isVisible:true})
//             }, delay);
//         };
//
//
//         handleMouseLeave = () => {
//             if (this.timeoutId) {
//                 clearTimeout(this.timeoutId)
//                 this.timeoutId = null;
//             }
//             this.setState({ isVisible: false});
//         };
//
//
//         render() {
//             const { children, content, position = "top"} = this.props;
//             const { isVisible } = this.state;
//
//             return (
//                 <span
//                     className="tooltip-wrapper"
//                     onMouseEnter={this.handleMouseEnter}
//                     onMouseLeave={this.handleMouseLeave}
//                 >
//         {children}
//                     {isVisible && (
//                         <span
//                             className={`tooltip-content ${position}`}
//                             ref={this.tooltipRef}
//                         >
//             {content}
//           </span>
//                     )}
//       </span>
//             );
//         }
//     }
//
//     return (
//         <>
//             <Tooltip content="This is a top tooltip" >
//                 <button>Top Tooltip</button>
//             </Tooltip>
//             <Tooltip content="This is a right tooltip" position="right">
//                 <button>Right Tooltip</button>
//             </Tooltip>
//             <Tooltip content="This is a left tooltip" position="left">
//                 <button>Left Tooltip</button>
//             </Tooltip>
//             <Tooltip content="This is a bottom tooltip" position="bottom">
//                 <button>Bottom Tooltip</button>
//             </Tooltip>
//             <Tooltip content="This is a delayed bottom tooltip with a 500ms delay" position="bottom" delay={500}>
//                 <button>Delayed Bottom Tooltip</button>
//             </Tooltip>
//         </>
//     )
// }

// function TabsComponent() {
//     interface TabProps {
//         id: string;
//         title: string;
//         children: ComponentChildren;
//     }
//
//     interface TabsProps {
//         children:ComponentChildren
//         defaultActiveTab?:string
//     }
//
//     interface TabsState {
//         activeTab: string|null
//     }
//
//
//     class Tab extends Component<TabProps> {
//         render() {
//             return <>{this.props.children}</>;
//         }
//     }
//
//
//     class Tabs extends Component<TabsProps,TabsState> {
//         static Tab = Tab;
//         state:TabsState={
//             activeTab:this.props.defaultActiveTab|| null
//         }
//         tabListRef = createRef<HTMLUListElement>();
//         componentDidMount() {
//             if(this.tabListRef.current) {
//                 this.tabListRef.current.scrollLeft = 0;
//             }
//         }
//         handleTabClick = (tabId:string) => {
//             this.setState({activeTab: tabId})
//         }
//         render() {
//             const {children} = this.props;
//             const { activeTab} = this.state;
//
//             const tabs = [];
//             const tabPanels = [];
//
//             if(Array.isArray(children)) {
//                 for (let i = 0; i < children.length; i++) {
//                     const child = children[i];
//                     if(typeof child === 'object' && child.type === Tab) {
//                         const tabId = child.props.id;
//                         const tabTitle = child.props.title;
//
//                         tabs.push(
//                             <li key={tabId}
//                                 className={`tab-item ${activeTab === tabId ? "active" : ""}`}
//                                 onClick={()=> this.handleTabClick(tabId)}
//                             >
//                                 {tabTitle}
//                             </li>
//                         )
//                         if(activeTab === tabId || (activeTab === null && this.props.defaultActiveTab === tabId) || (activeTab === null && this.props.defaultActiveTab === undefined && i ===0 )) {
//                             tabPanels.push(<div key={tabId} className="tab-panel">{child.props.children}</div>);
//                         }
//
//                     }
//                 }
//             }
//
//             return (
//                 <div className="tabs">
//                     <ul className="tab-list" ref={this.tabListRef}>
//                         {tabs}
//                     </ul>
//                     {tabPanels}
//                 </div>
//             );
//         }
//     }
//
//     return (
//         <>
//             <Tabs defaultActiveTab="tab2">
//                 <Tabs.Tab id="tab1" title="Tab 1">
//                     <div>Content for Tab 1</div>
//                 </Tabs.Tab>
//                 <Tabs.Tab id="tab2" title="Tab 2">
//                     <div>Content for Tab 2</div>
//                 </Tabs.Tab>
//                 <Tabs.Tab id="tab3" title="Tab 3">
//                     <div>Content for Tab 3</div>
//                 </Tabs.Tab>
//                 <Tabs.Tab id="tab4" title="Tab 4">
//                     <div>Content for Tab 4</div>
//                 </Tabs.Tab>
//                 <Tabs.Tab id="tab5" title="Tab 5">
//                     <div>Content for Tab 5</div>
//                 </Tabs.Tab>
//             </Tabs>
//         </>
//     )
// }

// function TextAreaComponent() {
//     interface Props {
//         value?: string;
//         onChange?: (value: string) => void;
//         placeholder?: string;
//         rows?:number;
//         cols?:number;
//         disabled?: boolean
//     }
//
//     interface State {
//         value: string;
//     }
//
//     class TextArea extends Component<Props, State> {
//         state: State = {
//             value: this.props.value || '',
//         };
//         textAreaRef = createRef<HTMLTextAreaElement>();
//
//         componentDidMount() {
//             if(this.textAreaRef.current) {
//                 this.textAreaRef.current.value = this.state.value;
//             }
//         }
//         componentDidUpdate(prevProps:Props) {
//             if (prevProps.value !== this.props.value && this.textAreaRef.current) {
//                 this.setState({ value: this.props.value || '' },() => this.textAreaRef.current!.value = this.state.value)
//             }
//         }
//
//         handleChange = (e: Event) => {
//             const newValue = (e.target as HTMLTextAreaElement).value;
//             this.setState({value: newValue},() => {
//                 if(this.props.onChange) {
//                     this.props.onChange(newValue)
//                 }
//             });
//         };
//
//         render() {
//             const { placeholder, rows, cols, disabled  } = this.props;
//             return (
//                 <textarea
//                     placeholder={placeholder}
//                     rows={rows}
//                     cols={cols}
//                     disabled={disabled}
//                     className="text-area"
//                     onInput={this.handleChange}
//                     ref={this.textAreaRef}
//                 />
//             );
//         }
//     }
//
//     const handleChange = (value: string) => {
//         console.log("Text Area Value:", value);
//     }
//
//     return (
//         <>
//             <h2>TextArea Example</h2>
//             <TextArea
//                 placeholder="Enter your text here"
//                 onChange={handleChange}
//             />
//             <h2>TextArea Example with rows and cols</h2>
//             <TextArea
//                 placeholder="Enter your text here"
//                 onChange={handleChange}
//                 rows={5}
//                 cols={30}
//             />
//             <h2>TextArea Example with disabled state</h2>
//             <TextArea
//                 placeholder="Enter your text here"
//                 onChange={handleChange}
//                 value="This is disabled textarea"
//                 disabled={true}
//             />
//
//         </>
//     );
// }

// function SliderComponent() {
//     interface Props {
//         min?: number;
//         max?: number;
//         step?: number;
//         value?: number;
//         onChange?: (value: number) => void;
//         disabled?: boolean;
//         showValue?: boolean;
//     }
//
//     interface State {
//         value: number;
//         isDragging: boolean;
//     }
//
//     class Slider extends Component<Props, State> {
//         static defaultProps: Partial<Props> = {
//             min: 0,
//             max: 100,
//             step: 1,
//             value: 0,
//             showValue: false,
//         };
//         state: State = {
//             value: this.props.value || 0,
//             isDragging: false
//         };
//
//         thumbRef = createRef<HTMLSpanElement>();
//         trackRef = createRef<HTMLDivElement>();
//         sliderInputRef = createRef<HTMLInputElement>();
//
//         componentDidMount() {
//             this.updateThumbPosition();
//         }
//         componentDidUpdate(prevProps:Props) {
//             if (prevProps.value !== this.props.value) {
//                 this.setState({value:this.props.value|| 0}, this.updateThumbPosition);
//             }
//         }
//
//
//         updateThumbPosition = () => {
//             const { min = 0, max = 100 } = this.props;
//             const { value } = this.state;
//             const trackElement = this.trackRef.current;
//             const thumbElement = this.thumbRef.current;
//
//             if(trackElement && thumbElement) {
//                 const trackWidth = trackElement.offsetWidth;
//                 const range = max - min;
//                 const percentage = (value - min) / range;
//                 const thumbPosition = trackWidth * percentage;
//                 thumbElement.style.left = `${thumbPosition}px`;
//             }
//
//         }
//         handleChange = (e: Event) => {
//             if(this.props.disabled) {
//                 return;
//             }
//             const newValue = parseInt((e.target as HTMLInputElement).value)
//             this.setState({value:newValue}, () => {
//                 if(this.props.onChange) {
//                     this.props.onChange(this.state.value);
//                 }
//                 this.updateThumbPosition();
//             });
//         };
//         handleTrackClick = (e:MouseEvent) => {
//             if(this.props.disabled) {
//                 return;
//             }
//             const trackElement = this.trackRef.current;
//             if(trackElement) {
//                 const trackRect = trackElement.getBoundingClientRect();
//                 const clickPosition = e.clientX - trackRect.left;
//                 const trackWidth = trackElement.offsetWidth;
//                 const { min = 0, max = 100 } = this.props;
//                 const range = max - min;
//                 const percentage =  clickPosition / trackWidth;
//                 const newValue = min +  range * percentage;
//                 const snappedValue = Math.round(newValue / (this.props.step||1)) * (this.props.step||1)
//
//                 if(newValue <= max && newValue >= min){
//                     this.setState({value:snappedValue}, () => {
//                         if(this.props.onChange) {
//                             this.props.onChange(this.state.value);
//                         }
//                         this.updateThumbPosition();
//                     });
//                 }
//
//             }
//         }
//
//         handleThumbMouseDown = (e:MouseEvent) => {
//             if(this.props.disabled) {
//                 return
//             }
//             this.setState({ isDragging: true });
//             document.addEventListener('mousemove', this.handleMouseMove);
//             document.addEventListener('mouseup', this.handleMouseUp);
//         }
//
//         handleMouseMove = (e:MouseEvent) => {
//             if(!this.state.isDragging) {
//                 return;
//             }
//             const trackElement = this.trackRef.current;
//             if(trackElement) {
//                 const trackRect = trackElement.getBoundingClientRect();
//                 const clickPosition = e.clientX - trackRect.left;
//                 const trackWidth = trackElement.offsetWidth;
//                 const { min = 0, max = 100 } = this.props;
//                 const range = max - min;
//                 const percentage =  clickPosition / trackWidth;
//                 const newValue = min +  range * percentage;
//                 const snappedValue = Math.round(newValue / (this.props.step||1)) * (this.props.step||1)
//
//                 if(newValue <= max && newValue >= min){
//                     this.setState({value:snappedValue},() => {
//                         if(this.props.onChange) {
//                             this.props.onChange(this.state.value)
//                         }
//                         this.updateThumbPosition();
//                     });
//                 }
//             }
//         };
//
//         handleMouseUp = () => {
//             this.setState({ isDragging: false });
//             document.removeEventListener('mousemove', this.handleMouseMove);
//             document.removeEventListener('mouseup', this.handleMouseUp);
//         };
//
//         render() {
//             const { min = 0, max = 100, step = 1, disabled, showValue } = this.props;
//             const {value} = this.state;
//             return (
//                 <div className="slider-container">
//                     {showValue && <div className="slider-value"> {value}</div>}
//                     <div className="slider-track"  onClick={this.handleTrackClick} ref={this.trackRef}>
//             <span
//                 className="slider-thumb"
//                 ref={this.thumbRef}
//                 onMouseDown={this.handleThumbMouseDown}
//             />
//                         <input
//                             type="range"
//                             min={min}
//                             max={max}
//                             step={step}
//                             value={value}
//                             disabled={disabled}
//                             className="slider-input"
//                             onInput={this.handleChange}
//                             ref={this.sliderInputRef}
//                         />
//                     </div>
//                 </div>
//             );
//         }
//     }
//
//     const handleChange = (value: number) => {
//         console.log("Slider Value:", value);
//     }
//
//     return (
//         <>
//             <h2>Basic Slider</h2>
//             <Slider onChange={handleChange} />
//             <h2>Basic Slider with steps</h2>
//             <Slider onChange={handleChange} step={10} />
//             <h2>Basic Slider with steps and show value</h2>
//             <Slider onChange={handleChange} step={10} showValue />
//             <h2>Slider with min, max and initial value</h2>
//             <Slider min={20} max={120} onChange={handleChange}  value={50}/>
//             <h2>Slider with disabled state</h2>
//             <Slider onChange={handleChange} disabled={true}/>
//         </>
//     );
// }

// function TransitionComponent() {
//     interface Props {
//         children?: ComponentChildren;
//         transitionInClass?: string;
//         transitionOutClass?: string;
//         duration?: number;
//         onTransitionEnd?: () => void;
//         show?:boolean
//     }
//
//     interface State {
//         isVisible: boolean;
//         transitionClass: string;
//     }
//     class Transition extends Component<Props, State> {
//         static defaultProps: Partial<Props> = {
//             transitionInClass: 'transition-in',
//             transitionOutClass: 'transition-out',
//             duration: 300,
//             show:true,
//
//         };
//         state: State = {
//             isVisible: this.props.show || false,
//             transitionClass: '',
//         };
//         transitionRef = createRef<HTMLDivElement>();
//         componentDidMount() {
//             if(this.props.show) {
//                 this.startTransition();
//             }
//         }
//
//         componentDidUpdate(prevProps:Props) {
//             if (prevProps.show !== this.props.show) {
//                 this.startTransition();
//             }
//         }
//         startTransition = () => {
//             const {show, transitionInClass, transitionOutClass, duration} = this.props;
//
//             this.setState({transitionClass: show? transitionInClass : transitionOutClass, isVisible: show });
//             setTimeout(() => {
//                 if (this.transitionRef.current && show) {
//                     this.transitionRef.current.style.transition = `all ${duration}ms ease-in-out`;
//                 } else if (this.transitionRef.current) {
//                     this.transitionRef.current.style.transition = `all ${duration}ms ease-in-out`;
//                 }
//             }, 10);
//             setTimeout(() => {
//                 if(!show) {
//                     this.setState({ isVisible:false, transitionClass:"" },() => {
//                         if(this.props.onTransitionEnd) {
//                             this.props.onTransitionEnd()
//                         }
//                     })
//                 } else {
//                     this.setState({ transitionClass:"" },() => {
//                         if(this.props.onTransitionEnd) {
//                             this.props.onTransitionEnd()
//                         }
//                     })
//                 }
//             }, duration + 10);
//         }
//         render() {
//             const { children } = this.props;
//             const { isVisible, transitionClass} = this.state;
//             return (
//                 isVisible &&
//                 <div className={`transition-container ${transitionClass}`} ref={this.transitionRef}>
//                     {children}
//                 </div>
//             );
//         }
//     }
//
//     const [show, setShow] = useState(false);
//     const handleTransitionEnd = () => {
//         console.log('Transition Ended')
//     }
//
//     return(
//         <>
//             <h2>Transition example</h2>
//             <button onClick={() => setShow(prev => !prev)}>Toggle</button>
//             <Transition  show={show} onTransitionEnd={handleTransitionEnd} duration={1000} >
//                 <div style={{ padding: '40px',  backgroundColor: '#f0f0f0', textAlign: 'center', border: '1px solid #ddd' }}>
//                     This will fade and slide in and out.
//                 </div>
//             </Transition>
//         </>
//     );
// }

// function ToastComponent() {
//     class Toast extends Component {
//         constructor(props) {
//             super(props);
//             this.state = {
//                 queue: [],
//             };
//             this.timers = [];
//         }
//         componentWillUnmount() {
//             if (this.timers) {
//                 this.timers.forEach(timer => {
//                     clearTimeout(timer);
//                 });
//             }
//             this.timers = [];
//         }
//
//         show = (message, duration) => {
//             const newQueue = [...this.state.queue, { message, id: Date.now() }];
//             this.setState({ queue: newQueue });
//
//             const timerId = setTimeout(() => {
//                 this.hide(newQueue[newQueue.length - 1].id);
//             }, duration || 3000);
//             this.timers.push(timerId);
//         };
//
//         hide = (id) => {
//             const newQueue = this.state.queue.filter((item) => item.id !== id);
//             this.setState({ queue: newQueue });
//         };
//
//         render() {
//             return (
//                 <div>
//                     {this.state.queue.map((item, index) => {
//                         const style = {
//                             position: 'absolute',
//                             left: '50%',
//                             top: `${10 + (index * 7)}%`,
//                             backgroundColor: '#333',
//                             color: '#fff',
//                             padding: '10px',
//                             border: '1px solid #666',
//                             borderRadius: '5px',
//                             marginLeft: '-150px',
//                             width: '300px',
//                             textAlign: 'center',
//                             zIndex: '1000',
//                         };
//                         return <div key={item.id} style={style}>{item.message}</div>;
//                     })}
//                 </div>
//             );
//         }
//     }
//
//     class App extends Component {
//         constructor(props) {
//             super(props);
//         }
//         showToasts = () => {
//             this.toastRef.show('Toast 1', 5000);
//         };
//
//         render() {
//             return (
//                 <div>
//                     <button onClick={this.showToasts}>Show Toasts</button>
//                     <Toast ref={(ref) => (this.toastRef = ref)} />
//                 </div>
//             );
//         }
//     }
//
//     return <App />;
// }

// function SelectComponent() {
//     interface ModernSelectProps {
//         options: string[];
//         selectedOption?: string;
//         onSelect: (option: string) => void;
//         placeholder?: string;
//         label?: string;
//     }
//
//     interface ModernSelectState {
//         isOpen: boolean;
//         selected: string | null;
//     }
//
//     class ModernSelect extends Component<ModernSelectProps, ModernSelectState> {
//         constructor(props: ModernSelectProps) {
//             super(props);
//             this.state = {
//                 isOpen: false,
//                 selected: props.selectedOption || null,
//             };
//         }
//
//         toggleDropdown = () => {
//             this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
//         };
//
//         handleOptionSelect = (option: string) => {
//             this.setState({ selected: option, isOpen: false }, () => {
//                 if (this.props.onSelect) {
//                     this.props.onSelect(option);
//                 }
//             });
//         };
//
//
//         render() {
//             const { options, placeholder, label } = this.props;
//             const { isOpen, selected } = this.state;
//
//             const displayValue = selected || placeholder || 'Select Option';
//
//             return (
//                 <div className="modern-select">
//                     {label && <label className="select-label">{label}</label>}
//                     <div className="select-header" onClick={this.toggleDropdown}>
//                         <span className="select-display">{displayValue}</span>
//                         <span className={`select-arrow ${isOpen ? 'open' : ''}`}>
//                          <i className="dropdown icon"></i>
//                      </span>
//                     </div>
//                     {isOpen && (
//                         <div className="select-options">
//                             {options.map((option) => (
//                                 <div
//                                     key={option}
//                                     className={`select-option ${selected === option ? 'selected' : ''}`}
//                                     onClick={() => this.handleOptionSelect(option)}
//                                 >
//                                     <span>{option}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             );
//         }
//     }
//
//     interface AppState {
//         selectedFruit: string | null;
//         selectedColor: string | null;
//     }
//
//     class App extends Component<{}, AppState> {
//         constructor(props: {}) {
//             super(props);
//             this.state = {
//                 selectedFruit: null,
//                 selectedColor: null,
//             };
//         }
//
//         handleFruitChange = (option: string) => {
//             this.setState({ selectedFruit: option });
//             console.log("Selected Fruit:", option);
//         };
//
//         handleColorChange = (option: string) => {
//             this.setState({ selectedColor: option });
//             console.log("Selected Color:", option);
//         };
//
//         render() {
//             const fruits = [
//                 'Apple', 'Banana', 'Orange', 'Mango', 'Grape',
//                 'Artichoke', 'Asparagus', 'Broccoli', 'Cabbage', 'Carrot',
//             ];
//             const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Black'];
//
//             return (
//                 <div style={{padding: '20px'}}>
//                     <h1>Modern Select Component</h1>
//
//                     <div style={{marginBottom: '20px'}}>
//                         <ModernSelect
//                             options={fruits}
//                             onSelect={this.handleFruitChange}
//                             placeholder="Select Fruit"
//                             label="Fruits"
//
//                         />
//                         <div style={{marginTop: '10px'}}> Selected Fruit: {this.state.selectedFruit} </div>
//                     </div>
//
//
//                     <div>
//                         <ModernSelect
//                             options={colors}
//                             onSelect={this.handleColorChange}
//                             placeholder="Select Color"
//                             label="Colors"
//                         />
//                         <div style={{marginTop: '10px'}}> Selected Color: {this.state.selectedColor} </div>
//
//                     </div>
//                 </div>
//             );
//         }
//     }
//
//     return (
//         <>
//             <App />
//         </>
//     )
// }

// function CheckBoxRadioComponent() {
//     interface ModernCheckboxProps {
//         id?: string;
//         label?: string;
//         checked?: boolean;
//         onChange: (checked: boolean) => void;
//     }
//
//     class ModernCheckbox extends Component<ModernCheckboxProps> {
//         handleChange = (e: Event) => {
//             const target = e.target as HTMLInputElement;
//             if (this.props.onChange) {
//                 this.props.onChange(target.checked);
//             }
//         };
//
//         render() {
//             const { id, label, checked } = this.props;
//             const inputId = id || `checkbox-${Math.random().toString(36).substring(2, 15)}`;
//
//             return (
//                 <div className="modern-checkbox">
//                     <input
//                         type="checkbox"
//                         id={inputId}
//                         checked={checked}
//                         onChange={this.handleChange}
//                     />
//                     {label &&  <label htmlFor={inputId}>{label}</label> }
//
//                 </div>
//             );
//         }
//     }
//
//     interface ModernRadioProps {
//         id?: string;
//         label?: string;
//         name: string;
//         value: string;
//         checked?: boolean;
//         onChange: (value: string) => void;
//     }
//
//
//     class ModernRadio extends Component<ModernRadioProps> {
//         handleChange = (e: Event) => {
//             const target = e.target as HTMLInputElement;
//             if (this.props.onChange) {
//                 this.props.onChange(target.value);
//             }
//         };
//
//         render() {
//             const { id, label, name, value, checked } = this.props;
//             const inputId = id || `radio-${Math.random().toString(36).substring(2, 15)}`;
//
//             return (
//                 <div className="modern-radio">
//                     <input
//                         type="radio"
//                         id={inputId}
//                         name={name}
//                         value={value}
//                         checked={checked}
//                         onChange={this.handleChange}
//                     />
//                     {label && <label htmlFor={inputId}>{label}</label>}
//                 </div>
//             );
//         }
//     }
//
//     interface AppState {
//         isAgreed: boolean;
//         selectedOption: string;
//     }
//
//     class App extends Component<{}, AppState> {
//         constructor(props: {}) {
//             super(props);
//             this.state = {
//                 isAgreed: false,
//                 selectedOption: 'option1'
//             };
//         }
//
//
//         handleCheckboxChange = (checked: boolean) => {
//             this.setState({ isAgreed: checked });
//             console.log("Checkbox changed:", checked)
//         };
//
//
//         handleRadioChange = (value: string) => {
//             this.setState({ selectedOption: value });
//             console.log("Radio Option changed:", value)
//         };
//
//         render() {
//             return (
//                 <div style={{ padding: '20px' }}>
//                     <h1>Modern Checkbox & Radio</h1>
//                     <div style={{marginBottom: '20px'}}>
//                         <ModernCheckbox
//                             label="I agree to terms and conditions"
//                             checked={this.state.isAgreed}
//                             onChange={this.handleCheckboxChange}
//                         />
//                     </div>
//                     <div>
//                         <ModernRadio
//                             name="radioOptions"
//                             label="Option 1"
//                             value="option1"
//                             checked={this.state.selectedOption === "option1"}
//                             onChange={this.handleRadioChange}
//                         />
//                         <ModernRadio
//                             name="radioOptions"
//                             label="Option 2"
//                             value="option2"
//                             checked={this.state.selectedOption === "option2"}
//                             onChange={this.handleRadioChange}
//                         />
//                         <ModernRadio
//                             name="radioOptions"
//                             label="Option 3"
//                             value="option3"
//                             checked={this.state.selectedOption === "option3"}
//                             onChange={this.handleRadioChange}
//                         />
//
//                     </div>
//                 </div>
//             );
//         }
//     }
//
//     return (
//         <>
//             <App />
//         </>
//     )
// }

function NewComponent() {

    return (
        <>
            <SelectComponent />
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid beatae corporis culpa ea hic incidunt iure libero magni mollitia natus nemo, nihil obcaecati odio quam quo reprehenderit saepe vero voluptates!</p>
        </>
    );
}

export default function () {

    return (
        <>
            <div class="xyz-ui">
                <NewComponent />
            </div>
        </>
    );
};