from fastapi import FastAPI, UploadFile
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

app = FastAPI()


if 'room-images' not in os.listdir():
    os.mkdir('room-images')

app.mount("/room-images", StaticFiles(directory="room-images"), name="room-images")
# it gives take files from folder as static without handling. (for exm get: domen.ru/room-images/test.png)


@app.post("/upload/{filename}")
async def upload_image(filename: str, file: UploadFile):
    if filename in os.listdir('room-images'):
        json_response = {"message": "file already uploaded earlier. User put request to change it"}
        return JSONResponse(content=json_response, status_code=409)

    contents = await file.read()
    with open('room-images/' + filename, "wb") as f:
        f.write(contents)
    return JSONResponse(content={"message": "file successfully saved"}, status_code=202)


@app.put("/put/{filename}")
async def change_image(filename: str, file: UploadFile):
    if filename in os.listdir('room-images'):
        os.remove('room-images/' + filename)

    contents = await file.read()
    with open('room-images/' + filename, "wb") as f:
        f.write(contents)
    return JSONResponse(content={"message": "file successfully changed"}, status_code=202)


@app.delete("/delete/{filename}")
async def delete_image(filename: str):
    if filename not in os.listdir('room-images'):
        return JSONResponse(content={"message": "nothing to remove"}, status_code=404)

    os.remove('room-images/' + filename)
    return JSONResponse(content={"message": "file successfully deleted"}, status_code=200)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
