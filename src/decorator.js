
@defineElement('num-counter')
class Counter extends HTMLElement {

  constructor() {
    super();
 
  }

  connectedCallback() { this.render(); }

  @bound
  render() {

  }
}