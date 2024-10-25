"use server";

import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { LangChainStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const userContext = body.userContext; // Expect userContext to be part of the request

    // Check if userContext is provided
    if (!userContext || !userContext.name) {
      throw new Error("User context is missing or incomplete.");
    }

    const { stream, handlers } = LangChainStream();

    // Configure OpenAI chat model
    const chatModel = new ChatOpenAI({
      model: "gpt-3.5-turbo-0125",
      streaming: true,
      callbacks: [handlers],
      temperature: 0.3,
    });

    // Construct chat history
    const chatHistory = messages.slice(0, -1).map((msg: { role: string; content: string }) => {
      return msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content);
    });

    const latestMessage = messages[messages.length - 1]?.content;
    const fullMessages = [...chatHistory, new HumanMessage(latestMessage)];

    // Add user context to the prompt
    const contextPrompt = `
      You are a friendly chatbot. Answer questions based on the user's profile and context provided below:
      Name: ${userContext.name}
      Occupation: ${userContext.occupation}
      Description: ${userContext.description}
      Background: ${JSON.stringify(userContext.background)}
      Interests: ${userContext.interests.join(", ")}

      Now, here is the latest question: ${latestMessage}
    `;

    // Generate response based on context and combined messages
    const response = await chatModel.invoke(fullMessages.concat(new HumanMessage(contextPrompt)));

    // Stream the response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in POST request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
