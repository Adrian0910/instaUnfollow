# InstaUnfollow
## Instagram Followers vs Following Analyzer

A simple, client‑side web tool to compare your Instagram **followers** and **following** lists using the official JSON export from Instagram.  
The app helps you quickly see:

- Who follows you and you follow back (mutuals)
- Who follows you but you don’t follow back
- Who you follow but (probably) doesn’t follow you back, with direct links to each profile

All processing happens in the browser – no data is sent to any server.

---

## Features

- Upload your Instagram `followers_1.json` and `following.json` files
- Automatically separate accounts into:
  - Mutual followers
  - Only followers (they follow you, you don’t)
  - Only following (you follow them, they don’t)
- Clickable profile links for **Only following** using the `https://www.instagram.com/_u/username` pattern
- Manual **override list** to fix inconsistencies in Instagram’s export (for accounts that do follow you but don’t appear in the JSON)
- Download the final **Only following** list (after overrides) as a plain text file
- Mobile‑first, responsive UI that works well on phones, tablets, and desktops
- Light/Dark theme toggle that respects system dark‑mode preference

---

## How it Works

This project uses only static HTML, CSS, and vanilla JavaScript.  
You open the page in your browser, load the JSON files you downloaded from Instagram, and the logic runs entirely on your device.

### Input files

The tool expects Instagram’s official data export in JSON format:

- `followers_1.json`  
  - An array where each item contains your followers
  - The username is read from `string_list_data[0].value`

- `following.json`  
  - An object that includes a `relationships_following` array
  - The username is read from the `title` property of each item

Using these usernames, the app builds two sets and computes three lists:

- **Mutuals**: in both followers and following
- **Only followers**: in followers but not in following
- **Only following**: in following but not in followers

---

## Getting Your Instagram JSON Files

To use this tool, you first need to export your data from Instagram:

1. Open Instagram (app or web) and log in to the account you want to analyze.
2. Go to **Settings**.
3. Open the **Accounts Center** (you can also access it via the browser at `https://accountscenter.instagram.com/`).
4. Go to **Your information and permissions**.
5. Choose **Download your information** or **Export your information**.
6. Select **Customize information** instead of downloading everything.
7. Deselect all categories and keep only **Connections** selected.
8. Choose **JSON** as the export format.
9. Confirm and request the export.
10. When you receive the email, download the ZIP file and extract it.
11. Inside the extracted folders, locate the **connections** section and find:
    - `followers_1.json`
    - `following.json`

These are the files you need to upload into the tool.

---

## Usage

1. Open `index.html` (or whatever you named the file) in a modern browser (Chrome, Edge, Firefox, Safari).
2. In section **1. Cargar archivos y comparar**:
   - Select your `followers_1.json` file in the followers field.
   - Select your `following.json` file in the following field.
   - Click **Comparar (solo JSON)**.
3. The tool will:
   - Parse both JSON files.
   - Extract the usernames.
   - Compute and display:
     - **Mutuos** (mutual followers)
     - **Solo Followers** (they follow you, you don’t)
     - **Solo Following** (you follow them, they don’t)
4. In **Solo Following** you’ll see a scrollable list of clickable usernames:
   - Each entry is a hyperlink to `https://www.instagram.com/_u/username`
   - Clicking a username opens the Instagram profile in a new tab.

---

## Manual Overrides (Fixing Missing Followers)

Instagram’s JSON export can sometimes be incomplete or inconsistent.  
If you know certain accounts **do** follow you (because you checked in the app) but they are missing from `followers_1.json`, you can add them manually:

1. Scroll to section **2. Correcciones manuales (overrides)**.
2. In the textarea, type each username that you know follows you, one per line, for example:
adrian0910
adrian_117
otro_usuario

3. Click **Recalcular con overrides**.
4. The app will:
- Treat those usernames as additional followers.
- Recompute all three lists.
- Move any overridden usernames out of **Solo Following** when appropriate.
5. When you are satisfied with the corrections, click **Descargar Solo Following (final)** to download the final list (with profile URLs) as a text file.

---

## Light/Dark Mode

The page includes a theme toggle in the top‑right corner:

- By default, it tries to match your system’s light/dark preference.
- You can manually switch between:
- Light mode (Material‑like light surfaces and blue primary)
- Dark mode (dark background with softer contrast and the same accent colors)

The toggle only affects UI colors; functionality remains the same.

---

## Tech Stack

- HTML5
- CSS3 (mobile‑first layout, flexbox, responsive typography with `clamp()`)
- Vanilla JavaScript:
- `FileReader` for client‑side JSON parsing
- `Blob` + `URL.createObjectURL()` for file download
- DOM manipulation for rendering results and links
- Simple theme toggling via a CSS class on `body`

No backend, no external dependencies, and no analytics. Everything runs in your browser.

---

## Limitations

- The accuracy depends entirely on the correctness and freshness of the JSON files exported by Instagram.
- If Instagram omits or delays updates in the export, the lists may not perfectly match what you see in the app.
- The tool cannot query Instagram’s API or app directly; it only works with the static export you provide.
- You should always **manually confirm** any account in the **Solo Following** list before making decisions such as unfollowing.

---

## Setup & Development

This is a purely static project:

1. Clone the repository.
2. Open the main HTML file (`index.html`) directly in a browser, or serve it with any static file server.
3. Edit the HTML/CSS/JS as needed to customize style, language, or behavior.

No build step is required.
