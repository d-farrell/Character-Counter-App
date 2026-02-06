class TextAnalyzer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Custom element added to page.");

    this.setupListeners();
  }

  setupListeners() {
    const textarea = this.querySelector("[data-text-analyzer='textarea']");

    textarea.addEventListener("input", this.handleTextareaInput.bind(this));
  }

  handleTextareaInput(event) {
    this.handleCharacterCount(event);
    this.handleWordCount(event)
    this.handleSentenceCount(event)
    this.handleLetterDensity(event)
  }

  handleCharacterCount(event) {
    const characters = event.target.value.length;
    const totalCharacters = this.querySelector("[data-text-analyzer='totalCharacters']");
    
    totalCharacters.textContent = characters;
  }

  handleWordCount(event) {
    const words = event.target.value.split(" ").filter(word => word !== " ").length;
    const wordCount = this.querySelector("[data-text-analyzer='wordCount']");

    wordCount.textContent = words;
  }

  handleSentenceCount(event) {
    const sentences = event.target.value.split(".").filter(sentence => sentence !== " ").length;
    const sentenceCount = this.querySelector("[data-text-analyzer='sentenceCount']");

    sentenceCount.textContent = sentences;
  }

  handleLetterDensity(event) {
    const densityList = this.querySelector("[data-text-analyzer='densityList']");
    const characters = event.target.value.split("").filter(character => character !== " ");
    
    // Count the occurrences of each character
    const characterCount = characters.reduce((acc, character) => {
      acc[character] = (acc[character] || 0) + 1;
      return acc;
    }, {});

    // Clear the list
    densityList.innerHTML = "";

    // Create or update list items for each character
    for (const character in characterCount) {
      // Check if a list item for this character already exists
      const existingItem = densityList.querySelector(`[data-character="${character.toUpperCase()}"]`);
      
      if (existingItem) {
        // Update existing item
        const progress = existingItem.querySelector("[data-text-analyzer='densityProgress']");
        const count = existingItem.querySelector("[data-text-analyzer='densityCount']");
        const percentage = existingItem.querySelector("[data-text-analyzer='densityPercentage']");
        
        progress.value = characterCount[character];
        count.textContent = characterCount[character];
        percentage.textContent = (characterCount[character] / characters.length * 100).toFixed(2) + "%";
      } else {
        // Create new list item
        const listItem = document.createElement("li");

        listItem.setAttribute("data-character", character.toUpperCase());
        listItem.setAttribute("data-text-analyzer", "densityListItem");
        
        listItem.innerHTML = `
          <span data-text-analyzer="densityCharacter">${character.toUpperCase()}</span>
          <progress data-text-analyzer="densityProgress" value="${characterCount[character]}" max="${characters.length}">0</progress>
          <span data-text-analyzer="densityCount">${characterCount[character]}</span>
          <span data-text-analyzer="densityPercentage">${(characterCount[character] / characters.length * 100).toFixed(2)}%</span>
        `;
        
        densityList.appendChild(listItem);

        // count the number of list items
        const listItemsCount = densityList.querySelectorAll("[data-text-analyzer='densityListItem']");
        
        // if there are more than 5 list items, show the see more button
        if (listItemsCount.length > 5) {
          const seeMoreButton = this.querySelector("[data-text-analyzer='densityListSeeMore']");
          seeMoreButton.style.display = "block";
        }

      }
    }
  }
}

customElements.define("text-analyzer", TextAnalyzer);