const { OpenAIEmbeddings } = require('@langchain/openai');
const { RetrievalQAChain } = require('langchain/chains');
const { ChatOpenAI } = require('@langchain/openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');

const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

const { default: weaviate } = require('weaviate-ts-client');

const { WeaviateStore } = require('@langchain/weaviate');
const { performance } = require('perf_hooks');
const fetch = require('node-fetch');

const client = weaviate.client({
  scheme: 'https',
  host: 'ljcyuin0t2s5tgu014y40g.c0.asia-southeast1.gcp.weaviate.cloud',
  apiKey: new weaviate.ApiKey('UGtoMTjnNhluaosStuyPMteGEondaHp1yy2B'),
});

createIndex = async (req, res) => {
  try {
    const data = req.body;
    const pdfData = await this.readPdf(
      'https://lilcdn.in/lil-upload/1714953600000/femh101-a31ZDY1vA_JyW.pdf'
    );

    if (pdfData && pdfData.length) {
      // Create a store and fill it with some texts + metadata
      await WeaviateStore.fromDocuments(
        pdfData,
        new OpenAIEmbeddings({
          OPENAI_API_KEY,
        }),
        {
          client,
          indexName: 'LMS',
          textKey: 'text',
          metadataKeys: ['bookName', 'author'],
        }
      );
    }

    res.status(200).json({ message: 'saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

addDocs = async (req, res) => {
  try {
    const data = req.body;
    const loadedVectorStore = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings({
        OPENAI_API_KEY,
      }),
      {
        client,
        indexName: 'LMS',
      }
    );

    const docs = await loadedVectorStore.addDocuments(data);
    res.status(200).json({
      status: true,
      message: 'Documents Added',
    });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

readPdf = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const respData = await response.blob();
    console.log(
      respData,
      '-------------------------------------------respData'
    );

    const loader = new PDFLoader(respData, {
      pdfjs: () => import('pdfjs-dist/legacy/build/pdf.mjs'),
    });

    const docs = await loader.load();
    console.log(docs.length, 'Number of docs');

    if (docs.length) {
      let i = 1;
      let s = 0;
      docs.forEach((_cD) => {
        console.log(
          _cD.pageContent.length,
          'Number of Characters in doc - ',
          i
        );
        s += _cD.pageContent.length || 0;
        i++;
        _cD.metadata = {
          bookName: data.bookName | '',
          author: data.author || 'NCERT',
        };
      });

      // splitter function
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 0,
      });

      // created chunks from pdf
      const splittedDocs = await splitter.splitDocuments(docs);
      console.log(docs[0].metadata, 'docs[0].metadata');
      return {
        splittedDocs: splittedDocs || [],
        totalPages: docs[0].metadata.pdf.totalPages || 0,
        totalChunks: splittedDocs.length || 0,
      };
    }

    return {
      splittedDocs: [],
      totalPages: 0,
      totalChunks: 0,
    };
  } catch (error) {
    console.log('Error:-', error);
  }
};

queryChain = async (req, res) => {
  try {
    const data = req.body;

    console.log(data, "data")
    if (data && data.query && data.query !== '') {
      const client = weaviate.client({
        scheme: process.env.WEAVIATE_SCHEME || 'https',
        host: process.env.WEAVIATE_HOST || 'localhost',
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

      if (completionText) {
        res.status(200).json({
          status: true,
          query: prompt,
          answer: completionText
        });
      }

      res.status(200).json({
        status: false,
        query: prompt,
        message: 'something went wrong!'
      });
    }

    res.status(400).json({ message: 'Invalid payload!' });
  } catch (err) {
    console.log(err, " ---------------- Error ---------------- ");
    res.status(400).json(err);
  }
};

uploadBook = async (req, res) => {
  const { BookEmbedding } = this.app.models;
  const { splittedDocs, totalPages, totalChunks } = await this.readPdf(
    data.fileUrl,
    data
  );
  if (totalPages && totalPages > 0) {
    await this.addDocs(accessToken, splittedDocs);
    const bookData = {
      name: data.name,
      fileUrl: data.fileUrl,
      isArchived: false,
      author: data.author || '',
      totalPages: totalPages || 0,
      totalChunks: totalChunks || 0,
    };

    return await BookEmbedding.create({
      ...bookData,
    });
  }

  return {
    error: true,
    message: 'There are no texts in given pdf!',
  };
};

module.exports = {
  createIndex,
  addDocs,
  readPdf,
  queryChain,
  uploadBook
};
