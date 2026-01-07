# ClinIQ Vault

ClinIQ Vault is a secure, department-aware healthcare knowledge management system designed to run in a private, on-premise environment. It leverages a powerful AI assistant (Google Gemini) to provide healthcare professionals with quick, context-aware answers from a managed knowledge base of medical documents, records, and protocols.

The system is built with a "privacy-first" approach, ensuring that all data is processed locally and access is strictly controlled on a departmental basis, aligning with standards like HIPAA.

## Team

- **Team Leader:** Shravani Dakve
- **Team Members:** Aditi Bhambid, Neha Dhotre, Yogita Patil, Khushboo Gawde

## Features

- **Departmental Scoping:** Data and access are siloed by department (e.g., Radiology, Oncology, Pathology). Users can only access and query documents within their authorized department.
- **Secure Authentication:** A department-based login system using shared access keys to control entry.
- **AI-Powered Chat Assistant:** A sophisticated chat interface allowing users to ask complex questions in natural language. The AI uses Retrieval-Augmented Generation (RAG) to provide answers based *only* on the documents available in the user's department.
- **Knowledge Base Management:** An interface for uploading, editing, and deleting departmental documents. The content of these documents forms the context for the AI assistant.
- **Interactive Dashboard:** Provides a real-time overview of system statistics, including the number of indexed documents, AI query traffic, storage usage, and security logs.
- **Local First & Privacy:** All chat history and document indexing are handled locally. No sensitive data ever leaves the secure environment.
- **Modern UI:** A clean, responsive, and intuitive user interface built with React and Tailwind CSS.

## Technology Stack

- **Frontend:**
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
- **AI & Generative Language:**
  - [Google Gemini API](https://ai.google.dev/)
- **UI Components & Libraries:**
  - [Recharts](https://recharts.org/) for data visualization and charts.
  - [Lucide React](https://lucide.dev/) for icons.

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or a compatible package manager
- A Google Gemini API Key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/ClinIQVault.git
    cd ClinIQVault
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your Google Gemini API key:
    ```env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

Once the setup is complete, you can start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Department Access Keys

To log in, use one of the following default department access keys:
- **Radiology:** `rad123`
- **Oncology:** `onc123`
- **Pathology:** `pat123`

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Serves the production build locally for preview.
