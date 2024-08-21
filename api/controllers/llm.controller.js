const { OpenAIEmbeddings } = require('@langchain/openai');
const { RetrievalQAChain } = require('langchain/chains');
const { OpenAI } = require('@langchain/openai');

const openAIApiKey = '';

const { PDFLoader } = require('langchain/document_loaders/fs/pdf');

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
    const pdfData = await this.readPdf(
      'https://lilcdn.in/lil-upload/1714953600000/femh101-a31ZDY1vA_JyW.pdf'
    );

    if (pdfData && pdfData.length) {
      // Create a store and fill it with some texts + metadata
      await WeaviateStore.fromDocuments(
        pdfData,
        new OpenAIEmbeddings({
          openAIApiKey,
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
    const loadedVectorStore = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey,
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
    if (data && data.query && data.query !== '') {
      const client = weaviate.client({
        scheme: process.env.WEAVIATE_SCHEME || 'https',
        host: process.env.WEAVIATE_HOST || 'localhost',
        // apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY || 'default')
      });

      const loadedVectorStore = await WeaviateStore.fromExistingIndex(
        // eslint-disable-next-line spellcheck/spell-checker
        new OpenAIEmbeddings({
          openAIApiKey,
        }),
        {
          client,
          indexName: 'LMS',
          metadataKeys: ['bookName', 'author'],
        }
      );

      const vectorStoreRetriever = loadedVectorStore.asRetriever();
      const model = new OpenAI({
        modelName: 'gpt-3.5-turbo',
        openAIApiKey,
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
        // prompt = `Imagine you are an expert teacher of ${data.subject}. I'm a ${data.role} at ${data.leaningLevel} grades. I need your help in explaining ${data.query}, Please help me with response in ${data.format} form and preferably within the allotted ${data.wordLimit} words.`
        prompt = `As a ${data.role} at ${data.leaningLevel} grades seeking expertise in ${data.subject}, I require assistance with ${data.query}. Kindly provide a ${data.format} response in ${data.language}, ideally within ${data.wordLimit} words.`;
      } else if (data && data.query && data.query !== '') {
        prompt = data.query;
      }

      if (data && data.isLatexIncluded) {
        prompt +=
          ' Use LaTeX for coefficients, symbols, expressions, and equations with double dollar signs($$).';
      }

      // prompt += " Extract the 'videoId' with 'url' and 'thumbnail'";
      // why it is important to Learn and provide me 3 day to day
      // activities where I can to leverage the learnings from ${data.query}
      // Also mention the list of keywords to focus in your response
      // with single line definition of each of these keywords.

      const startTime = performance.now();

      const answer = await chain.call({
        query: prompt,
      });
      // For response streaming
      // https://js.langchain.com/docs/modules/model_io/llms/streaming_llm

      const endTime = performance.now();
      const executionTime = endTime - startTime;
      console.log(`Execution time: ${executionTime} milliseconds`);

      const relevantDocuments = await vectorStoreRetriever.getRelevantDocuments(
        prompt
      );

      const videoDetail = await this.extractVideoDetails(relevantDocuments);
      const videoDetails = [
        ...new Map(videoDetail.map((item) => [item.videoId, item])).values(),
      ];
      console.log(videoDetails, 'videoDetails');

      const completionText = answer.text;

      this.count_and_store_tokens_in_DB(
        accessToken,
        prompt,
        completionText,
        executionTime,
        data.module && data.module !== '' ? data.module : 'promptBuilder',
        relevantDocuments
      );

      if (completionText) {
        return {
          status: true,
          query: prompt,
          answer: completionText,
          videoDetails,
        };
      }

      return {
        status: false,
        query: prompt,
        message: 'something went wrong!',
        videoDetails,
      };
    }

    return {
      status: false,
      message: 'Invalid payload!',
    };
  } catch (err) {
    console.log(' Error:- ', err);
    return {
      status: false,
      message: 'something went wrong!',
    };
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
    // Not to allow same book in books and embeddings @jatin-sharam
    const bookData = {
      name: data.name,
      subjectGroupId: data.subjectGroupId,
      subjectGroup: data.subjectGroup,
      // subjectId: data.subjectId,
      // subject: data.subject,
      // topicGroupId: data.topicGroupId,
      // topicGroup: data.topicGroup,
      // topicId: data.topicId,
      // topic: data.topic,
      // subTopicId: data.subTopicId,
      // subTopic: data.subTopic,
      fileUrl: data.fileUrl,
      isArchived: false,
      author: data.author || '',
      totalPages: totalPages || 0,
      totalChunks: totalChunks || 0,
    };
    if (
      data.subjectId &&
      data.subject &&
      data.subjectId !== '' &&
      data.subject !== ''
    ) {
      bookData.subjectId = data.subjectId;
      bookData.subject = data.subject;
    }

    if (
      data.topicGroupId &&
      data.topicGroup &&
      data.topicGroupId !== '' &&
      data.topicGroup !== ''
    ) {
      bookData.topicGroupId = data.topicGroupId;
      bookData.topicGroup = data.topicGroup;
    }

    if (
      data.topicId &&
      data.topic &&
      data.topicId !== '' &&
      data.topic !== ''
    ) {
      bookData.topicId = data.topicId;
      bookData.topic = data.topic;
    }

    if (
      data.subTopicId &&
      data.subTopic &&
      data.subTopicId !== '' &&
      data.subTopic !== ''
    ) {
      bookData.subTopicId = data.subTopicId;
      bookData.subTopic = data.subTopic;
    }

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
};
