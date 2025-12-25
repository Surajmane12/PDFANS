
from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore


embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-large"
)

def ingestPDF(file_path: str):
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter (
    chunk_size = 1000,
    chunk_overlap = 400
    )

    chunks = text_splitter.split_documents(documents=docs)

   

    embedding_model  = OpenAIEmbeddings(
        model = "text-embedding-3-large"
    )

    QdrantVectorStore.from_documents(
        documents=chunks,
        embedding=embedding_model,
        url="http://localhost:6333",
        collection_name="documents"
    )
