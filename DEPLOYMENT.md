# Deployment Guide: Smart Campus Connect

This guide explains how to **Host your Source Code** on GitHub and how to **Deploy the Web Version** of your app using GitHub Pages.

## Prerequisite: Initialize Git
(If you haven't done this already)

1.  Open your terminal in the project folder.
2.  Run these commands to prepare your local files:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

---

## Part 1: Host Source Code on GitHub

1.  **Create a Repository:**
    *   Go to [GitHub.com/new](https://github.com/new).
    *   Repository Name: `Smart-Campus-Connect`.
    *   Visibility: **Public** (or Private).
    *   **Do not** check "Initialize with README" or .gitignore (we already have them).
    *   Click **Create repository**.

2.  **Push Code:**
    *   Copy the commands under *"…or push an existing repository from the command line"*.
    *   Paste them into your terminal:
        ```bash
        git remote add origin https://github.com/<YOUR-USERNAME>/Smart-Campus-Connect.git
        git branch -M main
        git push -u origin main
        ```
    *   *Note: You may be asked to log in to GitHub in the browser.*

---

## Part 2: Host Web App (GitHub Pages)

You can host the **Web version** of your Expo app so anyone can view it in a browser.

1.  **Install `gh-pages` package:**
    ```bash
    npm install gh-pages --save-dev
    ```

2.  **Update `package.json`:**
    Add a `"homepage"` field and update `"scripts"`:

    ```json
    {
      "homepage": "http://<YOUR-USERNAME>.github.io/Smart-Campus-Connect",
      "scripts": {
        ...
        "deploy": "gh-pages -d web-build",
        "predeploy": "expo export -p web"
      }
    }
    ```

3.  **Deploy:**
    Run this command:
    ```bash
    npm run deploy
    ```

4.  **View Live Site:**
    Your app will be live at: `http://<YOUR-USERNAME>.github.io/Smart-Campus-Connect`

---

## Part 3: Mobile Deployment (Android/iOS)

To "host" the mobile app for users to download:

1.  **Expo EAS (Easiest):**
    *   Run `eas build --platform android` to generate an APK/AAB file.
    *   You can upload this file to Google Drive or the Play Store.

2.  **Expo Go (Development):**
    *   Just share the QR code from `npx expo start` with anyone connected to the same Wi-Fi.
