class TextAnalyzer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupListeners();
  }

  setupListeners() {
    const textareaEl = this.querySelector("[data-text-analyzer='textarea']");
    const characterLimitEl = this.querySelector("[data-text-analyzer='characterLimit']");
    const excludeSpacesEl = this.querySelector("[data-text-analyzer='excludeSpaces']");

    textareaEl.addEventListener("input", this.handleTextareaInput.bind(this));
    characterLimitEl.addEventListener("input", this.handleCharacterLimitInput.bind(this));
    excludeSpacesEl.addEventListener("change", this.handleExcludeSpacesChange.bind(this));
  }

  handleExcludeSpacesChange(event) {
    const isChecked = event.target.checked;

    if (isChecked == true) {
      this.excludeSpaces = true;
      this.handleCharacterCount(event);
    } else {
      this.excludeSpaces = false;
      this.handleCharacterCount(event);
    }
  }

  handleCharacterLimitInput(event) {
    const limitValue = Number(event.target.value);
    
    this.querySelector("[data-text-analyzer='textarea']").setAttribute("maxlength", limitValue);
  }

  handleTextareaInput(event) {
    this.handleCharacterCount(event);
    this.handleWordCount(event)
    this.handleSentenceCount(event)
    this.handleLetterDensity(event)
    this.handleReadingTime(event)
  }

  handleCharacterCount(event) {    
    let characterCount;
    const text = this.querySelector("[data-text-analyzer='textarea']").value;
    const totalCharactersEl = this.querySelector("[data-text-analyzer='totalCharacters']");

    if (this.excludeSpaces == true) {
      const textWithoutSpaces = text.replace(/\s/g, "");
      
      totalCharactersEl.length = characterCount;
      characterCount = textWithoutSpaces.length;
    } else {
      characterCount = text.length;
    }

    totalCharactersEl.textContent = characterCount;
  }

  handleWordCount(event) {
    const words = event.target.value.split(" ").filter(word => word !== " ").length;
    const wordCountEl = this.querySelector("[data-text-analyzer='wordCount']");

    wordCountEl.textContent = words;
  }

  handleSentenceCount(event) {
    const sentences = event.target.value.split(".").filter(sentence => sentence !== " ").length;
    const sentenceCountEl = this.querySelector("[data-text-analyzer='sentenceCount']");

    sentenceCountEl.textContent = sentences;
  }

  handleLetterDensity(event) {
    const densityListEl = this.querySelector("[data-text-analyzer='densityList']");
    const characters = event.target.value.split("").filter(character => character !== " ");
    
    const characterCount = characters.reduce((acc, character) => {
      acc[character] = (acc[character] || 0) + 1;
      return acc;
    }, {});

    densityListEl.innerHTML = "";

    for (const character in characterCount) {
      const existingItem = densityListEl.querySelector(`[data-character="${character.toUpperCase()}"]`);
      
      if (existingItem) {
        const progress = existingItem.querySelector("[data-text-analyzer='densityProgress']");
        const count = existingItem.querySelector("[data-text-analyzer='densityCount']");
        const percentage = existingItem.querySelector("[data-text-analyzer='densityPercentage']");
        
        progress.value = characterCount[character];
        count.textContent = characterCount[character];
        percentage.textContent = (characterCount[character] / characters.length * 100).toFixed(2) + "%";
      } else {
        const listItem = document.createElement("li");

        listItem.setAttribute("data-character", character.toUpperCase());
        listItem.setAttribute("data-text-analyzer", "densityListItem");
        
        listItem.innerHTML = `
          <span data-text-analyzer="densityCharacter">${character.toUpperCase()}</span>
          <progress data-text-analyzer="densityProgress" value="${characterCount[character]}" max="${characters.length}">0</progress>
          <span data-text-analyzer="densityCount">${characterCount[character]}</span>
          <span data-text-analyzer="densityPercentage">${(characterCount[character] / characters.length * 100).toFixed(2)}%</span>
        `;
        
        densityListEl.appendChild(listItem);

        const listItemsCount = densityListEl.querySelectorAll("[data-text-analyzer='densityListItem']");
        
        if (listItemsCount.length > 5) {
          const seeMoreButtonEl = this.querySelector("[data-text-analyzer='densityListSeeMore']");
          seeMoreButtonEl.style.display = "block";
        }
      }
    }
  }

  handleReadingTime(event) {
    const wordsPerMinute = 225;
    const words = event.target.value.trim().split(/\s+/);
    const wordCount = words.filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const readingTimeEl = this.querySelector("[data-text-analyzer='readingTime']");
    const readingTimeUnitEl = this.querySelector("[data-text-analyzer='readingTimeUnit']");

    readingTimeEl.textContent = readingTime;
    readingTimeUnitEl.textContent = "minutes";
  }
}

customElements.define("text-analyzer", TextAnalyzer);