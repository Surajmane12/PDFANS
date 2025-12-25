

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
load_dotenv()
from openai import OpenAI
from langchain_qdrant import QdrantVectorStore



openai_client = OpenAI()



embedding_model = OpenAIEmbeddings(
    model = "text-embedding-3-large"
)

vector_store = QdrantVectorStore.from_existing_collection(
   url = "http://localhost:6333",
   collection_name = "documents",
   embedding = embedding_model
)

def query_rag(query:str):
    results = vector_store.similarity_search(query = query)
    print("vector results:",results)

    context = "\n".join([r.page_content for r in results])

   
    SYSTEM_PROMPT = f"""
        You are a helpful AI assistant.

        STRICT RULES:
        - Use ONLY the provided context.
        - Do NOT write in a single paragraph.
        - Every topic MUST start on a new line.
        - Use line breaks exactly as shown.
        - Do NOT inline multiple topics on one line.

        MANDATORY RESPONSE FORMAT:

        Relevant Topics Found

        - **<Topic Title>**
        - 📄 Page: <page number>
        - 📝 <Short description>

        - **<Topic Title>**
        - 📄 Page: <page number>
        - 📝 <Short description>

        CONTEXT:
        {context}
"""



    response = openai_client.chat.completions.create(
        model = "gpt-5",
        messages = [
          
              {"role":"system","content":SYSTEM_PROMPT},
              {"role":"user","content":query}
        ]
    )

    print("🤖AI: ",response.choices[0].message.content)

    return response.choices[0].message.content


