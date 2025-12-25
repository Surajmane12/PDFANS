from dotenv import load_dotenv
from fastapi import FastAPI, Query, UploadFile
from ingestPDF import ingestPDF
from query import query_rag
from models import QueryRequest
app = FastAPI()

@app.get('/')
def root():
    return {"status: Server is running"}


@app.post('/upload')
async def upload_pdf(file:UploadFile):
    print("file we received: ",file)
    path = f"./docs{file.filename}"
    with open(path,"wb") as f:
        f.write(await file.read())
    ingestPDF(path)
    return {"status":"file uploaded!!"}

@app.post('/query')
async def query(req:QueryRequest):
    print("Question Recieved: ",req.question)
    res = query_rag(req.question)
    return {"answer":res}