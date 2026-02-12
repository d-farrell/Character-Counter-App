# Character Counter App

A real-time text analysis tool that provides comprehensive statistics about your text as you type. Built with modern web technologies and featuring a beautiful dark/light theme toggle.

![Character Counter App - Desktop](https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_700/Challenges/zbvrotjht8wmzzjjwjbd.jpg)

![Character Counter App - Mobile](https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_700/Challenges/ocxq5yikhjmaw2rrg9ke.jpg)

## DEMO
https://character-counter-app-two.vercel.app/

## 🎯 Features

- **Real-time Text Analysis**: Get instant statistics as you type
- **Character Counting**: Track total characters with option to exclude spaces
- **Word Count**: Automatically count words in your text
- **Sentence Count**: Identify and count sentences
- **Letter Density**: Visual breakdown of character frequency with progress bars
- **Reading Time**: Calculate approximate reading time (based on 225 words per minute)
- **Character Limit**: Set custom character limits with visual feedback
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with Web Components
- **Tailwind CSS v4**: Utility-first CSS framework with custom theme configuration
- **Vanilla JavaScript**: ES6+ with Web Components API
- **Custom Fonts**: DM Sans font family (Regular, SemiBold, Bold)

### Key Technologies

- **Web Components**: Custom elements (`<text-analyzer>` and `<theme-switcher>`) for modular, reusable functionality
- **Tailwind CSS v4**: Latest version with CSS-first configuration using `@theme` and `@utility` directives
- **CSS Custom Properties**: Theme variables for colors and typography
- **Modern JavaScript**: ES6 classes, event listeners, and DOM manipulation

## 📦 Installation

1. **Clone the repository** (or download the project files)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the CSS build process**:
   ```bash
   npm run build-css
   ```
   This will watch for changes and automatically rebuild the CSS.

4. **Open the project**:
   - Simply open `index.html` in your browser, or
   - Use a local development server (e.g., `python -m http.server` or `npx serve`)

## 🚀 Usage

### Basic Usage

1. Open `index.html` in your web browser
2. Start typing in the textarea or paste your text
3. View real-time statistics:
   - Total characters (with option to exclude spaces)
   - Word count
   - Sentence count
   - Letter density breakdown
   - Approximate reading time

### Features

#### Exclude Spaces
- Check the "Exclude Spaces" checkbox to count only non-space characters
- Useful for character limits that don't count spaces

#### Character Limit
- Check "Set Character Limit" to enable character limiting
- Enter your desired limit in the number input
- The textarea will enforce the limit automatically

#### Theme Toggle
- Click the sun/moon icon in the top right to switch between dark and light themes
- Your preference persists during the session

#### Letter Density
- See which characters appear most frequently in your text
- View progress bars showing relative frequency
- Click "See More" if there are more than 5 unique characters

## 🔧 Development

### Building CSS

The project uses Tailwind CSS v4 with a watch mode for development:

```bash
npm run build-css
```

This command:
- Watches `assets/styles.css` for changes
- Generates `assets/output.css` automatically
- Rebuilds when HTML/JS files change (for class detection)

### File Changes

- **HTML**: Edit `index.html` for structure and content
- **Styles**: Edit `assets/styles.css` for CSS and Tailwind configuration
- **Components**: Edit `assets/text-analyzer.js` and `assets/theme-switcher.js` for functionality

### Browser Support

- Modern browsers with ES6+ support
- Web Components API support required
- CSS Custom Properties support

## 📝 Notes

- The CSS build process must be running for Tailwind classes to work
- Generated `output.css` should not be edited directly (it's auto-generated)
- Custom fonts (DM Sans) are loaded locally from the `assets/fonts` directory
- Dark mode is the default theme

## 🎯 Future Enhancements

Potential features for future versions:

- Export statistics as JSON/CSV
- Copy statistics to clipboard
- Multiple language support
- Additional text analysis metrics
- Save/load text drafts
- Character frequency charts

## 📄 License

ISC License

---

Built with ❤️ using modern web technologies
