# Hosting MARGIN Server

To enable the "Community Notes" and "Sync" features, you need to host the backend server. The extension is currently configured to look for `http://localhost:3000`.

## 1. Local Testing
You can run the server on your machine:

```bash
cd server
npm install
npm start
```
The server will start on port 3000. The extension will work immediately.

## 2. Public Hosting (Render.com example)
To share notes with others, host the server online.

1.  **Create a Repo**: Push the `server/` folder to a new GitHub repository.
2.  **Deploy**:
    - Go to [Render.com](https://render.com) (free tier available).
    - Select **"New Web Service"**.
    - Connect your repo.
    - Build Command: `npm install`
    - Start Command: `node index.js`
3.  **Get URL**: Render will give you a URL (e.g., `https://margin-api.onrender.com`).

## 3. Update Extension
Once deployed:

1.  Open `utils/network_utils.js`.
2.  Update `SERVER_URL`:
    ```javascript
    const SERVER_URL = "https://your-app-name.onrender.com/api/v1";
    ```
3.  Open `manifest.json` and add your domain to `host_permissions`:
    ```json
    "host_permissions": [
        "<all_urls>",
        "https://your-app-name.onrender.com/*"
    ]
    ```
4.  Reload the extension.

## 4. Database
The current server uses a simple file-based JSON database (`db.json`).
- **Pros**: Zero configuration.
- **Cons**: On some free hosts (like Render), the file system is ephemeral (reset on redeploy).
- **Production**: Configure `server/index.js` to use MongoDB or PostgreSQL if you need permanent persistence on ephemeral hosts.
