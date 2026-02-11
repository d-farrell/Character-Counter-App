class TextAnalyzer extends HTMLElement {
  constructor() {
    super()

    this.boundHandlers = {
      textareaInput: this.handleTextareaInput.bind(this),
      characterLimitInput: this.handleCharacterLimitInput.bind(this),
      excludeSpacesChange: this.handleExcludeSpacesChange.bind(this),
      characterLimitToggle: this.handleCharacterLimitToggle.bind(this),
      densityListSeeMoreClick: this.handleDensityListSeeMoreClick.bind(this),
    }
  }

  connectedCallback() {
    this.cacheElements()
    this.setupListeners()
  }

  cacheElements() {
    const selector = key => this.querySelector(`[data-text-analyzer="${key}"]`)
    this.els = {
      textarea: selector('textarea'),
      characterLimit: selector('characterLimit'),
      excludeSpaces: selector('excludeSpaces'),
      characterLimitCheckbox: selector('characterLimitCheckbox'),
      densityListSeeMore: selector('densityListSeeMore'),
      totalCharacters: selector('totalCharacters'),
      wordCount: selector('wordCount'),
      sentenceCount: selector('sentenceCount'),
      densityList: selector('densityList'),
      densityListEmpty: selector('densityListEmpty'),
      readingTime: selector('readingTime'),
      readingTimeUnit: selector('readingTimeUnit'),
    }
  }

  setupListeners() {
    const requiredElements = [
      this.els.textarea,
      this.els.characterLimit,
      this.els.excludeSpaces,
      this.els.characterLimitCheckbox,
      this.els.densityListSeeMore,
    ]

    if (requiredElements.some(el => el === null)) {
      console.warn(
        'TextAnalyzer: One or more required elements missing. Check [data-text-analyzer] attributes.'
      )
      return
    }

    this.els.textarea.addEventListener(
      'input',
      this.boundHandlers.textareaInput
    )
    this.els.characterLimit.addEventListener(
      'input',
      this.boundHandlers.characterLimitInput
    )
    this.els.excludeSpaces.addEventListener(
      'change',
      this.boundHandlers.excludeSpacesChange
    )
    this.els.characterLimitCheckbox.addEventListener(
      'change',
      this.boundHandlers.characterLimitToggle
    )
    this.els.densityListSeeMore.addEventListener(
      'click',
      this.boundHandlers.densityListSeeMoreClick
    )
  }

  handleExcludeSpacesChange(event) {
    const isChecked = event.target.checked

    if (isChecked === true) {
      this.excludeSpaces = true
      this.handleCharacterCount()
    } else {
      this.excludeSpaces = false
      this.handleCharacterCount()
    }
  }
  handleCharacterLimitToggle(event) {
    const isChecked = event.target.checked

    this.els.characterLimit.style.display = isChecked ? 'inline-block' : 'none'
  }

  handleCharacterLimitInput(event) {
    const limitValue = Number(event.target.value)
    if (Number.isNaN(limitValue) || limitValue < 0) return

    if (!this.els.textarea) return

    if (limitValue === 0) {
      this.els.textarea.removeAttribute('maxlength')
    } else {
      this.els.textarea.setAttribute('maxlength', limitValue)
    }
  }

  handleTextareaInput(event) {
    this.handleCharacterCount(event)
    this.handleWordCount(event)
    this.handleSentenceCount(event)
    this.handleLetterDensity(event)
    this.handleReadingTime(event)
  }

  handleCharacterCount() {
    let characterCount
    const text = this.els.textarea.value
    const totalCharactersEl = this.els.totalCharacters

    if (this.excludeSpaces === true) {
      const textWithoutSpaces = text.replace(/\s/g, '')
      characterCount = textWithoutSpaces.length
    } else {
      characterCount = text.length
    }

    if (characterCount > 0) {
      totalCharactersEl.textContent = characterCount.toString().padStart(2, '0')
    } else {
      totalCharactersEl.textContent = '00'
    }
  }

  handleWordCount(event) {
    const text = event.target.value.trim()
    const words =
      text.length > 0
        ? text.split(/\s+/).filter(word => word.length > 0).length
        : 0
    const wordCountEl = this.els.wordCount

    if (words > 0) {
      wordCountEl.textContent = words.toString().padStart(2, '0')
    } else {
      wordCountEl.textContent = '00'
    }
  }

  handleSentenceCount(event) {
    const trimmedSentences = event.target.value
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    const sentences = trimmedSentences.length
    const sentenceCountEl = this.els.sentenceCount

    if (sentences > 0) {
      sentenceCountEl.textContent = sentences.toString().padStart(2, '0')
    } else {
      sentenceCountEl.textContent = '00'
    }
  }

  handleLetterDensity(event) {
    const densityListEl = this.els.densityList
    const characters = event.target.value
      .split('')
      .filter(character => character !== ' ')

    const characterCount = characters.reduce((acc, character) => {
      const upperChar = character.toUpperCase()
      acc[upperChar] = (acc[upperChar] || 0) + 1
      return acc
    }, {})

    densityListEl.innerHTML = ''

    // Sort characters by frequency (descending) and show top 5
    const sortedCharacters = Object.entries(characterCount).sort(
      (a, b) => b[1] - a[1]
    )

    sortedCharacters.forEach(([character, count]) => {
      const percentage = ((count / characters.length) * 100).toFixed(2)

      const listItem = document.createElement('li')
      listItem.classList.add(
        'flex',
        'flex-row',
        'items-center',
        'gap-4',
        'w-full'
      )
      listItem.setAttribute('data-character', character)
      listItem.setAttribute('data-text-analyzer', 'densityListItem')

      listItem.innerHTML = `
        <span class="text-neutral-0 light:text-neutral-900 text-lg min-w-[24px]" data-text-analyzer="densityCharacter">${character}</span>
        <div class="flex flex-1 h-3">
          <progress class="w-full h-full rounded-full bg-neutral-800 light:bg-neutral-200" data-text-analyzer="densityProgress" value="${count}" max="${characters.length}">0</progress>
        </div>
        <span class="text-neutral-0 light:text-neutral-900 text-base text-right min-w-[100px] whitespace-nowrap" data-text-analyzer="densityStats">${count} (${percentage}%)</span>
      `

      densityListEl.appendChild(listItem)
    })

    const listItemsCount = Object.keys(characterCount).length
    const seeMoreButtonEl = this.els.densityListSeeMore

    if (listItemsCount > 5) {
      seeMoreButtonEl.style.display = 'block'
    } else {
      seeMoreButtonEl.style.display = 'none'
    }

    this.handleDensityListEmptyMessage()
  }

  handleDensityListSeeMoreClick(event) {
    const densityListElSetHeight = 200
    const densityListEl = this.els.densityList
    const seeMoreButtonEl = this.els.densityListSeeMore
    const densityListElRealHeight = densityListEl.scrollHeight

    if (this.isExpanded === undefined) {
      this.isExpanded = false
    }

    this.isExpanded = !this.isExpanded
    seeMoreButtonEl?.setAttribute('aria-expanded', this.isExpanded)

    if (this.isExpanded === true) {
      densityListEl.style.maxHeight = densityListElRealHeight + 'px'
    } else {
      densityListEl.style.maxHeight = densityListElSetHeight + 'px'
    }
  }

  handleDensityListEmptyMessage() {
    const textareaEl = this.els.textarea
    const emptyEl = this.els.densityListEmpty
    if (!textareaEl || !emptyEl) return

    emptyEl.style.display = textareaEl.value.length > 0 ? 'none' : 'block'
  }

  handleReadingTime(event) {
    const wordsPerMinute = 225
    const words = event.target.value.trim().split(/\s+/)
    const wordCount = words.filter(word => word.length > 0).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    const readingTimeEl = this.els.readingTime
    const readingTimeUnitEl = this.els.readingTimeUnit

    readingTimeEl.textContent = readingTime
    readingTimeUnitEl.textContent = readingTime === 1 ? 'minute' : 'minutes'
  }

  disconnectedCallback() {
    const textareaEl = this.els.textarea
    const characterLimitEl = this.els.characterLimit
    const excludeSpacesEl = this.els.excludeSpaces
    const characterLimitCheckboxEl = this.els.characterLimitCheckbox
    const densityListSeeMoreEl = this.els.densityListSeeMore

    textareaEl?.removeEventListener('input', this.boundHandlers.textareaInput)
    characterLimitEl?.removeEventListener(
      'input',
      this.boundHandlers.characterLimitInput
    )
    excludeSpacesEl?.removeEventListener(
      'change',
      this.boundHandlers.excludeSpacesChange
    )
    characterLimitCheckboxEl?.removeEventListener(
      'change',
      this.boundHandlers.characterLimitToggle
    )
    densityListSeeMoreEl?.removeEventListener(
      'click',
      this.boundHandlers.densityListSeeMoreClick
    )
  }
}

customElements.define('text-analyzer', TextAnalyzer)
