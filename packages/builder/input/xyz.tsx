import { render, Component } from 'preact';
// @ts-ignore
import data from './data.json';
// import * as arc from './mx';
// import {block} from "million";

debugger;

class App extends Component {
    state = {
        // map: new Map(),
        // set: new Set(),
    }

  render() {
    return <>
        <div>XYZ</div>
        <div>XYZ</div>
        <div>XYZ</div>
        <div>XYZ</div>
        <div>XYZ</div>
    </>;
  }

  interface() {
      TRACE: {
          console.log('interface');
      }
  }

  get catch() {
    return 'catch';
  }
}

render(<App />, document.body);

// console.log(arc);
console.log(data);
console.log(data.afg);
console.log(typeof data.afg);
// console.log(typeof Promise);
// assert.eq(typeof Promise === 'string');