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
    const characterLimitCheckboxEl = this.querySelector("[data-text-analyzer='characterLimitCheckbox']");

    textareaEl.addEventListener("input", this.handleTextareaInput.bind(this));
    characterLimitEl.addEventListener("input", this.handleCharacterLimitInput.bind(this));
    excludeSpacesEl.addEventListener("change", this.handleExcludeSpacesChange.bind(this));
    characterLimitCheckboxEl.addEventListener("change", this.handleCharacterLimitToggle.bind(this));
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
  handleCharacterLimitToggle(event) {
    const isChecked = event.target.checked;

    if (isChecked == true) {
      this.characterLimit = true;
    } else {
      this.characterLimit = false;
    }

    this.querySelector("[data-text-analyzer='characterLimit']").style.display = isChecked ? "inline-block" : "none";
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
    const words = event.target.value.split("").filter(word => word !== " ").length;
    const wordCountEl = this.querySelector("[data-text-analyzer='wordCount']");

    if (words > 0) {
      wordCountEl.textContent = words;
    } else {
      wordCountEl.textContent = "00";
    }
  }

  handleSentenceCount(event) {
    const trimmedSentences = event.target.value.split(".").map(s => s.trim()).filter(s => s.length > 0);
    const sentences = trimmedSentences.length;
    const sentenceCountEl = this.querySelector("[data-text-analyzer='sentenceCount']");

    if (sentences > 0) {
      sentenceCountEl.textContent = sentences;
    } else {
      sentenceCountEl.textContent = "00";
    }
  }

  handleLetterDensity(event) {
    const densityListEl = this.querySelector("[data-text-analyzer='densityList']");
    const characters = event.target.value.split("").filter(character => character !== " ");
    
    const characterCount = characters.reduce((acc, character) => {
      const upperChar = character.toUpperCase();
      acc[upperChar] = (acc[upperChar] || 0) + 1;
      return acc;
    }, {});

    densityListEl.innerHTML = "";

    // Sort characters by frequency (descending) and show top 5
    const sortedCharacters = Object.entries(characterCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    sortedCharacters.forEach(([character, count]) => {
      const percentage = ((count / characters.length) * 100).toFixed(2);
      
      const listItem = document.createElement("li");
      listItem.classList.add("flex", "flex-row", "items-center", "gap-4", "w-full");
      listItem.setAttribute("data-character", character);
      listItem.setAttribute("data-text-analyzer", "densityListItem");
      
      listItem.innerHTML = `
        <span class="text-neutral-0 light:text-neutral-900 text-lg min-w-[24px]" data-text-analyzer="densityCharacter">${character}</span>
        <div class="flex-1 h-3">
          <progress class="w-full h-full rounded-full bg-neutral-700 light:bg-neutral-200" data-text-analyzer="densityProgress" value="${count}" max="${characters.length}">0</progress>
        </div>
        <span class="text-neutral-0 light:text-neutral-900 text-base text-right min-w-[100px] whitespace-nowrap" data-text-analyzer="densityStats">${count} (${percentage}%)</span>
      `;
      
      densityListEl.appendChild(listItem);
    });

    const listItemsCount = Object.keys(characterCount).length;
    const seeMoreButtonEl = this.querySelector("[data-text-analyzer='densityListSeeMore']");
    
    if (listItemsCount > 5) {
      seeMoreButtonEl.style.display = "block";
    } else {
      seeMoreButtonEl.style.display = "none";
    }

    this.handleDensityListEmptyMessage(event);
  }

  handleDensityListEmptyMessage(event) {
    if (event.target.value.length > 0) {
      this.querySelector("[data-text-analyzer='densityListEmpty']").style.display = "none";
    } else {
      this.querySelector("[data-text-analyzer='densityListEmpty']").style.display = "block";
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