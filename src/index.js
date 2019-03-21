class VegaWebComponent extends HTMLElement {
  static get observedAttributes() {
    return ["spec"];
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `<div id="view"></div>`;
  }

  connectedCallback() {
    if (!this.view) {
      this._render(JSON.parse(this.spec));
    }
  }

  disconnectedCallBack() {
    let container = this.shadowRoot.querySelector("#view");
    if (container) {
      container.innerHTML = "";
    }
    if (this.view) {
      this.view.finalize(); // Prepares the view to be removed
    }
    this.view = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "spec") {
      this._updateSpec();
    }
  }

  _updateSpec() {
    if (!this.view) return;
    this._render(JSON.parse(this.spec));
  }

  _render(spec) {
    let container = this.shadowRoot.querySelector("#view");
    spec.width = container.offsetWidth || spec.width || 300;
    spec.height = container.offsetHeight || spec.height || 200;
    spec.autosize = { type: "fit", resize: true };
    this.view = new vega.View(vega.parse(spec))
      .renderer("canvas") // set renderer (canvas or svg)
      .initialize(this.shadowRoot.querySelector("#view"))
      .hover()
      .run();
  }

  set spec(val) {
    this.setAttribute("spec", val);
  }

  get spec() {
    return this.getAttribute("spec");
  }
}

window.addEventListener("WebComponentsReady", function(e) {
  window.customElements.define("vega-chart", VegaWebComponent);
});
