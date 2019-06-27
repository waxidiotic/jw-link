# JW Link

Interface with hosted players and content via JW Player Management API. For use with [Visual Studio Code](https://code.visualstudio.com).

## Uses

- Embedding JW Platform-hosted players and content via a single-line embed
- Generating a URL for a cloud-hosted player library
- Generating a URL for JW Platform-hosted content's HLS manifest

## Commands

- **Update API Credentials** - Configure the extension with the API credentials for the JW Player Dashboard property you would like to use. Using this command will also refresh the list of players and content locally stored.

- **Refresh Content and Players** - Refresh the list of players and content locally stored. This command would be used if you add or delete players and/or content on your JW Player Dashboard.

- **Add Single-Line Embed** - Displays a choice of the property's cloud-hosted players and content. Once both the player and content are chosen, a single-line embed code will be inserted in your document at the cursor's placement.
  - Example: `https://cdn.jwplayer.com/players/MEDIAID-PLAYERID.js`

- **Add Cloud-Hosted Player Library** - Displays a choice of the property's cloud-hosted players. Once chosen, a cloud-hosted player's URL will be inserted in your document at the cursor's placement.
  - Example: `https://cdn.jwplayer.com/libraries/PLAYERID.js`

- **Add Content URL (HLS)** - Displays a choice of the content hosted on your JW Platform account. Once chosen, the content's HLS manifest URL will be inserted in your document at the cursor's placement.
  - Example: `https://cdn.jwplayer.com/manifests/MEDIAID.m3u8`

## Other Useful JW Player Developer Resources

- [JW Player Snippets - Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=waxidiotic.jwplayer-snippets)
- [JW Developer](https://developer.jwplayer.com/)