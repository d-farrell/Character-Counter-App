class ThemeModeSwitcher extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupListeners();
  }

  setupListeners() {
    const darkModeButtonEl = this.querySelector("[data-theme-switcher='darkModeButton']");
    const lightModeButtonEl = this.querySelector("[data-theme-switcher='lightModeButton']");

    darkModeButtonEl.addEventListener("click", this.handleDarkModeClick.bind(this));
    lightModeButtonEl.addEventListener("click", this.handleLightModeClick.bind(this));
  }

  handleDarkModeClick() {
    this.querySelector("[data-theme-switcher='darkModeButton']").style.display = "none";
    this.querySelector("[data-theme-switcher='lightModeButton']").style.display = "block";

    document.body.classList.remove("light");
    document.body.classList.add("dark");
  }

  handleLightModeClick() {
    this.querySelector("[data-theme-switcher='darkModeButton']").style.display = "block";
    this.querySelector("[data-theme-switcher='lightModeButton']").style.display = "none";

    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
}

customElements.define("theme-switcher", ThemeModeSwitcher);