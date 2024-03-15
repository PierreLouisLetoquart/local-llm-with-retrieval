import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import type { Document } from "langchain/document";

const stdin = process.stdin;
const stdout = process.stdout;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["user", "{input}"],
]);

const prompt_retrieval =
  ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {input}`);

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

const documentChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt: prompt_retrieval,
});

async function getInput(question: string): Promise<string> {
  return new Promise((resolve) => {
    stdin.resume();
    stdout.write(question);
    stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

function modelOutput(res: string) {
  stdout.write("(assistant) ==> ");
  stdout.write(res);
  stdout.write("\n\n");
}

async function processInput(input: string): Promise<Document[] | null> {
  const urls = input.match(/(https?:\/\/[^\s]+)/g);

  if (!urls) {
    return null;
  }

  stdout.write("(system) ==> Loading context...");
  const loader = new CheerioWebBaseLoader(urls.join(","));
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  stdout.write("Done\n");
  return splitDocs;
}

console.log(
  "Enter a question to ask the model, if you want to use a context, provide a link to a document.",
);

while (true) {
  const input = await getInput("==> ");
  const docs = await processInput(input);

  if (docs) {
    stdout.write("(assistant) ==> Thinking...\n");
    const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    const retriever = vectorstore.asRetriever();
    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    const res = await retrievalChain.invoke({ input });
    modelOutput(res.answer);
  } else {
    stdout.write("(assistant) ==> Thinking...\n");
    const res = await llmChain.invoke({ input });
    modelOutput(res);
  }
}
