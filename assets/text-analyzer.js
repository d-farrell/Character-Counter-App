class TextAnalyzer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Custom element added to page.");
  }
}

customElements.define("text-analyzer", TextAnalyzer);