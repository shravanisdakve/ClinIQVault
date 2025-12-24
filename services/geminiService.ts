
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Document, Department } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askHealthcareAI(
  query: string,
  department: Department,
  authorizedDocs: Document[]
): Promise<string> {
  // Simulate the "Retrieval" part of RAG
  // In a real private cloud, this would be a Qdrant query with metadata filter: { department: "Radiology" }
  const relevantContext = authorizedDocs
    .filter(doc => doc.department === department)
    .map(doc => `[DOCUMENT: ${doc.name}]\n${doc.content}`)
    .join('\n\n');

  const systemInstruction = `
    You are ClinIQ Vault, a secure, offline-compatible Healthcare Knowledge Assistant.
    Your environment is a private server isolated from the public internet.
    
    CRITICAL SECURITY PROTOCOL:
    1. Access Context: You are currently assisting the ${department} department.
    2. Data Isolation: You only have access to the documents provided in the context below. 
    3. Privacy: Do not mention any names or sensitive identifiers unless explicitly present in the provided context.
    4. Accuracy: If the answer is not in the provided documents, state clearly that you do not have that information in the authorized records.
    
    AUTHORIZED DEPARTMENT RECORDS:
    ${relevantContext || "No documents found for this department."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.1, // High precision for medical contexts
      },
    });

    return response.text || "I'm sorry, I couldn't process that query.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "Error communicating with the private LLM node. Please check server status.";
  }
}
