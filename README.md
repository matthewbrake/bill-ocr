# AI Bill Analyzer (Simplified for Self-Hosting)

An intuitive application that uses the Gemini AI to scan and analyze utility bills. Upload an image of your bill to extract key information, visualize usage data, and export the results.

This version has been simplified for easy self-hosting on your own computer.

## Features

-   **Intelligent OCR**: Accurately extracts key details, line items, and usage chart data from any bill image using Gemini.
-   **Editable Data**: Review and edit all extracted data before saving or exporting.
-   **Data Export**: Download analysis to a CSV file or submit the data to a form endpoint.
-   **Persistent History**: Your analysis history is saved in your browser's local storage for privacy and convenience.
-   **Client-Side Rate Limiting**: Prevents accidental API spam by limiting requests.

---

## How to Run This App on Your Computer

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher) and npm installed.

### Step 1: Create Your Environment File

This is where you'll put your secret keys.

1.  In the project's main folder, create a new file named `.env`.
2.  Open the `.env` file and add the following, pasting your keys where indicated:

    ```bash
    # Required: Your Google Gemini API Key.
    # Get a free key from Google AI Studio: https://aistudio.google.com/app/apikey
    API_KEY="YOUR_GEMINI_API_KEY_HERE"

    # Optional: If you want to use the "Submit Form" button, create a free
    # form endpoint at https://formspree.io/ and paste the ID here.
    FORMSPREE_FORM_ID="YOUR_FORMSPREE_ID_HERE"
    ```

### Step 2: Install and Build the App

Open your terminal or command prompt in the project folder and run these commands:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Build the application:**
    This command reads your `.env` file and builds the static files into the `dist/` directory.
    ```bash
    npm run build
    ```

### Step 3: Serve the Application

You need a simple local server to run the app. We recommend the `serve` package.

1.  **Install the server (if you haven't already):**
    ```bash
    npm install -g serve
    ```

2.  **Start the server:**
    This command starts the default server on port 3000.
    ```bash
    serve -s . -l 3000
    ```
    To run the app on a different port, change the number after the `-l` flag. For example, to use port **3008**, run this command instead:
    ```bash
    serve -s . -l 3008
    ```


3.  **Access the Application:**
    Open your web browser and navigate to the address provided in your terminal (e.g., **[http://localhost:3000](http://localhost:3000)** or **[http://localhost:3008](http://localhost:3008)**).

The application should now be running locally on your machine!

---

## A Note on Data Storage (Database and Files)

You might want the app to automatically save uploaded bills and CSVs into a folder on your computer. For security reasons, web applications that run in a browser are **not allowed** to directly access your local file system. They cannot create folders, save files without your permission, or manage a local database file (like a `.db` file).

To implement that functionality, a separate backend server would be required, which is beyond the scope of this frontend project.

As a secure, browser-based alternative, this application:
1.  **Saves your analysis history** to your browser's `localStorage`.
2.  **Lets you download** the data as a CSV file anytime.