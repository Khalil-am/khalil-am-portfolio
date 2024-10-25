"use server";

import { getVectorStore } from "@/lib/vectordb";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { Redis } from "@upstash/redis";
import { LangChainStream, Message, StreamingTextResponse } from "ai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const latestMessage = messages[messages.length - 1].content;

    const { stream, handlers } = LangChainStream();

    // Cache initialization
    const cache = new UpstashRedisCache({
      client: Redis.fromEnv(),
    });

    // Configure OpenAI chat models
    const chatModel = new ChatOpenAI({
      model: "gpt-3.5-turbo-0125",
      streaming: true,
      callbacks: [handlers],
      verbose: true,
      cache,
      temperature: 0.3,
    });

    const rephraseModel = new ChatOpenAI({
      model: "gpt-3.5-turbo-0125",
      verbose: true,
      cache,
    });

    const retriever = (await getVectorStore()).asRetriever();

    // Define a custom prompt based on chat history
    const chatHistory = messages.slice(0, -1).map((msg: Message) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content),
    );

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Based on the conversation history, generate a search query to retrieve information relevant to the current inquiry. Include essential keywords only.",
      ],
    ]);

    const historyAwareRetrievalChain = await createHistoryAwareRetriever({
      llm: rephraseModel,
      retriever,
      rephrasePrompt,
    });

    // Define final prompt for Ted's portfolio chatbot
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are Khalil Support, a friendly chatbot on khalils's personal portfolio site, aimed at engaging potential employers. " +
        "Answer questions concisely based on the context provided, emphasizing Ted’s expertise as a software developer. " +
        "Where relevant, link to portfolio pages with further information. Format responses in markdown.\n\n" +
        "Context:\n{context}",
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate("Page content:\n{page_content}"),
      documentSeparator: "\n------\n",
    });

    // Create the retrieval chain for document searching based on chat history
    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever: historyAwareRetrievalChain,
    });

    retrievalChain.invoke({
      input: latestMessage,
      chat_history: chatHistory,
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
