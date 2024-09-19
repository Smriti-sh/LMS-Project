const { OpenAIEmbeddings } = require('@langchain/openai');
const { RetrievalQAChain } = require('langchain/chains');
const { ChatOpenAI } = require('@langchain/openai');
const Records = require('../models/records.model');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WEAVIATE_SCHEME = process.env.WEAVIATE_SCHEME;
const WEAVIATE_HOST = process.env.WEAVIATE_HOST;
const WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY;

const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');

const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

const { default: weaviate } = require('weaviate-ts-client');

const { WeaviateStore } = require('@langchain/weaviate');
const { performance } = require('perf_hooks');
const fs = require('fs');
const { query } = require('express');

const client = weaviate.client({
  scheme: 'https',
  host: 'yzfyasyhroftxobszxkg.c0.asia-southeast1.gcp.weaviate.cloud',
  apiKey: new weaviate.ApiKey('3I2jRBj9Wq8I2tVPN3nkTudvxdULv86eXHqh'),
});

const addDocs = async (data, storeInNewIndex=false) => {
  try {
    const { documents } = data;

    if (storeInNewIndex) {
      // Create a store and fill it with some texts + metadata
      const resp = await WeaviateStore.fromDocuments(
        documents,
        new OpenAIEmbeddings({
          OPENAI_API_KEY,
        }),
        {
          client,
          indexName: 'LMS',
          textKey: 'text',
          metadataKeys: ['bookName', 'authorName'],
        }
      );

      console.log('Documents added to vector store:', resp);

      return resp;

    } else {
      const loadedVectorStore = await WeaviateStore.fromExistingIndex(
        new OpenAIEmbeddings({
          OPENAI_API_KEY,
        }),
        {
          client,
          indexName: 'LMS',
        }
      );

      const docs = await loadedVectorStore.addDocuments(documents);
      console.log('Documents added to vector store:', docs);

      return docs;
    }
  } catch (err) {
    console.error('Error adding documents to vector store:', err);
    throw new Error('Failed to add documents to vector store');
  }
};

const readPdf = async (filePath, data) => {
  try {
    // Read the PDF file from the local filesystem as a Buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Convert the Buffer to a Blob (which PDFLoader expects)
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });


    const loader = new PDFLoader(blob, {
      pdfjs: () => import('pdfjs-dist/legacy/build/pdf.mjs'),
    });

    // Load the PDF and extract text
    const docs = await loader.load();

    console.log(docs.length, "Length");

    if (docs.length) {
      docs.forEach((doc, index) => {
        doc.metadata = {
          ...doc.metadata,
          bookName: data.bookName,
          author: data.authorName || 'LIL',
        };
      });

      // Split the documents into smaller chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 10,
      });
      const splittedDocs = await splitter.splitDocuments(docs);

      return {
        splittedDocs,
        totalPages: docs.length,
        totalChunks: splittedDocs.length
      };
    }

    return {
      splittedDocs: [],
      totalPages: 0,
      totalChunks: 0
    };
  } catch (error) {
    console.error('Error reading PDF:', error);
    throw new Error('Failed to read PDF');
  }
};

queryChain = async (req, res) => {
  try {
    const data = req.body;
    if (data && data.query && data.query !== '') {

      const client = weaviate.client({
        scheme: 'https',
        host: 'yzfyasyhroftxobszxkg.c0.asia-southeast1.gcp.weaviate.cloud',
        apiKey: new weaviate.ApiKey('3I2jRBj9Wq8I2tVPN3nkTudvxdULv86eXHqh'),
      });


      const loadedVectorStore = await WeaviateStore.fromExistingIndex(
        new OpenAIEmbeddings({
          OPENAI_API_KEY,
        }),
        {
          client,
          indexName: 'LMS',
          metadataKeys: ['bookName', 'author'],
        }
      );

      const vectorStoreRetriever = loadedVectorStore.asRetriever();
      const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        OPENAI_API_KEY,
      });

      const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);

      let prompt = '';
      if (
        data &&
        data.subject &&
        data.role &&
        data.leaningLevel &&
        data.format &&
        data.query &&
        data.wordLimit &&
        data.language
      ) {
        prompt = `As a ${data.role} at ${data.leaningLevel} grades seeking expertise in ${data.subject}, I require assistance with ${data.query}. Kindly provide a ${data.format} response in ${data.language}, ideally within ${data.wordLimit} words.`;
      } else if (data && data.query && data.query !== '') {
        prompt = data.query;
      }

      if (data && data.isLatexIncluded) {
        prompt +=
          ' Use LaTeX for coefficients, symbols, expressions, and equations with double dollar signs($$).';
      }

      const startTime = performance.now();

      const answer = await chain.call({
        query: prompt,
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;
      console.log(`Execution time: ${executionTime} milliseconds`);

      const completionText = answer.text;

      //TODO insert query and response in DB
      const saveRecords = new Records({
        query,
        answer:answer.text
      });
      await saveRecords.save();


      if (completionText) {
        return res.status(200).json({
          status: true,
          query: prompt,
          answer: completionText
        });
      }

      return res.status(200).json({
        status: false,
        query: prompt,
        message: 'something went wrong!'
      });
    }

    return  res.status(400).json({ message: 'Invalid payload!' });
  } catch (err) {
    console.log(err, " ---------------- Error ---------------- ");
    return res.status(400).json(err);
  }
};

const uploadBook = async (data) => {
  try {
    const { filePath, bookName, authorName } = data;

    // Read the PDF and split it into chunks
    const { splittedDocs, totalPages, totalChunks } = await readPdf(filePath, { bookName, authorName });

    console.log(splittedDocs, "splittedDocs", totalPages, "totalPages", totalChunks, "totalChunks");

    if (totalPages > 0) {
      // Add documents to the vector store
      await addDocs({ documents: splittedDocs }, true);

      console.log(`Book '${bookName}' with ${totalChunks} chunks added to vector store.`);
      return { success: true, totalPages, totalChunks };
    } else {
      console.error('No texts in the given PDF!');
      return { success: false };
    }
  } catch (error) {
    console.error('Error uploading book:', error);
    throw new Error('Failed to upload the book and create embeddings');
  }
};

module.exports = {
  addDocs,
  readPdf,
  queryChain,
  uploadBook
};
