# Configuring Formspree for Data Submission

This application includes a "Submit Form" button designed to send the extracted bill data to an endpoint. [Formspree](https://formspree.io/) is an easy-to-use service that allows you to create form endpoints without writing any backend code. When a user clicks the button, the data is sent to your Formspree account, which then emails it to you.

This is perfect for using the app as a lead-generation tool for potential customers or as an internal tool for your team.

## Step 1: Create a New Form in Formspree

1.  Sign up or log in to your [Formspree account](https://formspree.io/login).
2.  Click the **"+ New Form"** button on your dashboard.
3.  Give your form a name (e.g., "Bill Analyzer Submissions") and provide the email address where you want to receive submissions.
4.  Click **"Create Form"**.

## Step 2: Get Your Form Endpoint URL

After creating the form, Formspree will provide you with a unique URL for your form endpoint. It will look something like this:

`https://formspree.io/f/YOUR_UNIQUE_FORM_ID`

Copy this URL. You will need it for the next step.

## Step 3: Update the Application Code

Now, you need to tell the application where to send the data.

1.  Open the source code for the project.
2.  Navigate to the file: `src/components/BillDataDisplay.tsx`.
3.  Find the `<form>` element near the bottom of the file. It looks like this:

    ```tsx
    <form 
        action="https://formspree.io/f/YOUR_FORM_ID" // Replace with your Formspree form ID
        method="POST"
        className="no-print"
    >
        {/* ... form content ... */}
    </form>
    ```

4.  **Replace the `action` URL** with the unique URL you copied from your Formspree dashboard.

    For example:
    ```tsx
    <form 
        action="https://formspree.io/f/mqkrvylp" // Your actual URL here
        method="POST"
        className="no-print"
    >
    ```

## Step 4: Rebuild and Deploy

If you have made this change, you need to rebuild the application for it to take effect. If you are using Docker, run:

```bash
docker-compose up --build
```

Now, when a user clicks the "Submit Form" button, the complete bill data (in JSON format) will be sent to your email address via Formspree. You will receive an email with the subject line "New Bill Submission - Acct #..." and the body will contain all the extracted details.
