"use server";

import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { LangChainStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const latestMessage = messages[messages.length - 1].content;

    const { stream, handlers } = LangChainStream();

    // Configure OpenAI chat model
    const chatModel = new ChatOpenAI({
      model: "gpt-3.5-turbo-0125", // Use the desired OpenAI model
      streaming: true,
      callbacks: [handlers],
      temperature: 0.3,
    });

    // Construct chat history
    const chatHistory = messages.slice(0, -1).map((msg: { role: string; content: string }) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content),
    );

    // Combine the latest message with chat history
    const fullMessages = [...chatHistory, new HumanMessage(latestMessage)];

    // Generate response based on combined messages
    const response = await chatModel.invoke(fullMessages); // Pass the combined messages directly

    // Stream the response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
