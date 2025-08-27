# AI Bill Analyzer

An intuitive, production-grade application that uses AI to scan and analyze utility bills. Upload an image of your bill to extract key information, visualize usage data, and export the results.

This project is a single-page frontend application built with React and TypeScript. It has been containerized with Docker for easy and reliable deployment.

## Advanced Features

- **Multi-AI Provider Support**: Choose between the cloud-based Google Gemini API or a self-hosted local Ollama instance.
- **Persistent History & Settings**: Your analysis history and AI settings are securely saved in your browser's local storage.
- **Client-Side Rate Limiting**: Helps manage costs by preventing more than 5 analysis requests in a 5-minute period.
- **Data Export**: Export any analysis to a CSV file or submit the data to a form endpoint.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Quickstart & Deployment

Follow these steps to build and run the application.

### 1. Build and Run with Docker Compose

With Docker running on your machine, execute the following command from the root of the project directory:

```bash
docker-compose up --build
```

This command will build the Docker image, create a container, and start the application.

### 2. Access the Application

Once the container is running, open your web browser and navigate to:

[http://localhost:8080](http://localhost:8080)

You should see the AI Bill Analyzer application running.

### 3. Configure the AI Provider

Before you can analyze a bill, you must configure an AI provider.
1.  In the app, click the **settings icon (⚙️)** in the top-right corner.
2.  Follow the detailed instructions in the **"Configuring the AI Provider"** section below to set up either Google Gemini or a local Ollama model.

---

## Configuring the AI Provider

You can choose your provider from the settings panel inside the app.

### Option A: Google Gemini (Cloud-based)

This is the easiest way to get started and generally provides the highest accuracy.

1.  **Get an API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create a free API key.
2.  **Open Settings**: In the app, click the settings icon (⚙️).
3.  **Enter Key**: On the "Google Gemini" tab, paste your API key into the input field.
4.  **Save**: Click "Save Settings". You are now ready to analyze bills.

### Option B: Ollama (Self-Hosted Local AI)

This option allows you to run the AI entirely on your own machine for free. It requires a one-time setup.

1.  **Download and Install Ollama**: Go to [https://ollama.com/](https://ollama.com/) and download the application for your operating system.
2.  **Pull a Vision Model**: Open your terminal (or Command Prompt) and run the following command to download `llava`, a powerful vision model:
    ```bash
    ollama run llava
    ```
    Wait for the download to complete. You can then close the terminal.
3.  **Open Settings**: In the app, click the settings icon (⚙️).
4.  **Configure Ollama**:
    -   Click the **"Ollama (Local)"** tab.
    -   Ensure the **Ollama Server URL** is `http://localhost:11434` (this is the default).
    -   Ensure the **Model Name** is `llava`.
5.  **Save**: Click "Save Settings". You are now ready to analyze bills using your local AI.

### Providing a Default API Key (Optional)

For developers who want to pre-configure the app with a default Gemini API key during the build process, you can create a `.env` file.

1.  Rename `example.env` to `.env`.
2.  Open the `.env` file and add your key: `API_KEY=YOUR_GEMINI_API_KEY_HERE`.

When you run `docker-compose up --build`, this key will be set as the default in the application's settings. Users can still override it later in the settings panel.
