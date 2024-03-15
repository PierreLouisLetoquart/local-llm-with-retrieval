import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { Document } from "langchain/document";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["user", "{input}"],
]);

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  maxConcurrency: 5,
});

const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "mistral",
});

const outputParser = new StringOutputParser();

const llmChain = prompt.pipe(chatModel).pipe(outputParser);

async function getInput(question: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    stdin.resume();
    stdout.write(question);
    stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function processInput(input: string): Promise<Document[] | null> {
  const urls = input.match(/(https?:\/\/[^\s]+)/g);

  if (!urls) {
    return null;
  }

  const loader = new CheerioWebBaseLoader(urls.join(","));
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  return splitDocs;
}

while (true) {
  console.log(
    "Enter a question to ask the model, if you want to use a context, provide a link to a document.",
  );
  const input = await getInput("==> ");

  const docs = await processInput(input);

  if (docs) {
    console.log("Loading context...");
    const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    const prompt =
      ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

    <context>
    {context}
    </context>

    Question: {input}`);

    const documentChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
    });

    // We will use the vectorstore as a retriever
    const retriever = vectorstore.asRetriever();

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    const res = await retrievalChain.invoke({ input });

    console.log(res);
  } else {
    const res = await llmChain.invoke({ input });
    console.log(res);
  }
}
