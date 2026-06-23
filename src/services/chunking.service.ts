//Aca creo los chunks y contexto de la historia clinica para el llm y los guardo en bd:

import { RecursiveCharacterTextSplitter  } from "langchain/text_splitter";


const splitter = new recursivecharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks= await splitter.splitText("Chunks for the clinical history context to store in db");