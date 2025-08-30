# AI Bill Analyzer (Simplified for Self-Hosting)

An intuitive application that uses AI to scan and analyze utility bills. Upload an image of your bill to extract key information, visualize usage data, and export the results.

This version has been simplified for easy self-hosting and now supports both the **Google Gemini** cloud API and a local **Ollama** instance.

## Features

-   **Flexible AI Backend**: Choose between the powerful Google Gemini API or a private, local Ollama instance.
-   **Intelligent OCR**: Accurately extracts key details, line items, and usage chart data from any bill image.
-   **Editable Data**: Review and edit all extracted data before saving or exporting.
-   **Data Export**: Download analysis to a CSV file or submit the data to a form endpoint.
-   **Persistent History & Settings**: Your analysis history and AI provider settings are saved in your browser's local storage for privacy and convenience.

---

## How to Run This App on Your Computer

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher) and npm installed.

### Step 1: Create Your Environment File (Optional)

You can provide default keys in a `.env` file. These can be overridden later in the app's settings panel.

1.  In the project's main folder, create a new file named `.env`.
2.  Open the `.env` file and add the following. These will be the default values when the app first loads.

    ```bash
    # Optional: Your Google Gemini API Key can be set as a default.
    # Get a free key from Google AI Studio: https://aistudio.google.com/app/apikey
    API_KEY="YOUR_GEMINI_API_KEY_HERE"

    # Optional: If you want to use the "Submit Form" button, create a free
    # form endpoint at https://formspree.io/ and paste the ID here.
    FORMSPREE_FORM_ID="YOUR_FORMSPREE_ID_HERE"
    ```

### Step 2: Install and Build the App

Open your terminal in the project folder and run these commands:

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
    To run the app on a different port, change the number. For example, to use port **3008**:
    ```bash
    serve -s . -l 3008
    ```

3.  **Access and Configure the Application:**
    -   Open your web browser and navigate to the address from your terminal (e.g., `http://localhost:3000`).
    -   Click the **cog icon** in the top-right corner to open the **AI Provider Settings**.
    -   Here you can select either **Gemini** (and enter your API key) or **Ollama** (and enter your local server URL/model name).
    -   Your choice is saved in your browser for future visits.

The application is now running on your machine!
