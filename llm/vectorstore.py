# from qdrant_client import QdrantClient
# from langchain_openai import OpenAIEmbeddings

# client = QdrantClient(host="localhost",port=6333)

# embedding_model = OpenAIEmbeddings(model="text-embedding-3-large")

# def store_chunks(chunks,metadata):
#     client.add(
#         collection_name="documents",
#         documents= chunks,
#         embedding = embedding_model,
#         metadata=[metadata]*len(chunks)
#     )


from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
from uuid import uuid4

client = QdrantClient(url="http://localhost:6333")

def store_chunks(chunks, embeddings, metadata):
    points = []

    for chunk, vector in zip(chunks, embeddings):
        points.append(
            PointStruct(
                id=str(uuid4()),
                vector=vector,
                payload={
                    "text": chunk,
                    **metadata
                }
            )
        )

    client.upsert(
        collection_name="documents",
        points=points
    )
