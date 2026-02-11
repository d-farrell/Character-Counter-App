class ThemeModeSwitcher extends HTMLElement {
  constructor() {
    super()

    this.boundHandlers = {
      darkModeClick: this.handleDarkModeClick.bind(this),
      lightModeClick: this.handleLightModeClick.bind(this),
    }
  }

  connectedCallback() {
    this.cacheElements()
    this.setupListeners()
  }

  cacheElements() {
    const selector = key => this.querySelector(`[data-theme-switcher="${key}"]`)
    this.els = {
      darkModeButton: selector('darkModeButton'),
      lightModeButton: selector('lightModeButton'),
    }
  }

  setupListeners() {
    const requiredElements = [this.els.darkModeButton, this.els.lightModeButton]

    if (requiredElements.some(el => el === null)) {
      console.warn(
        'ThemeSwitcher: One or more required elements missing. Check [data-theme-switcher] attributes.'
      )
      return
    }

    this.els.darkModeButton.addEventListener(
      'click',
      this.boundHandlers.darkModeClick
    )
    this.els.lightModeButton.addEventListener(
      'click',
      this.boundHandlers.lightModeClick
    )
  }

  handleDarkModeClick() {
    this.els.darkModeButton.style.display = 'none'
    this.els.lightModeButton.style.display = 'block'

    document.body.classList.remove('light')
    document.body.classList.add('dark')
  }

  handleLightModeClick() {
    this.els.darkModeButton.style.display = 'block'
    this.els.lightModeButton.style.display = 'none'

    document.body.classList.remove('dark')
    document.body.classList.add('light')
  }
}

customElements.define('theme-switcher', ThemeModeSwitcher)
