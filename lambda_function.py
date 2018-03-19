from mimetypes import MimeTypes
from base64 import b64encode

mt = MimeTypes()

def lambda_handler(event, context):
    path: str = event["path"]
    print(f"Path is {path}")
    if path.startswith("/showMeTheCurrency"):
        path = path[18:]

    if path == "":
        filename = "index.html"
    else:
        path = path.lstrip("/")
        filename = path
    print(f"Filename is {filename}")
    try:
        with open(filename, "rb") as f:
            content = f.read()

        if filename.endswith(".png"):
            content = b64encode(content)
        content = content.decode("utf8")
        return {
            "statusCode": "200",
            "headers": {
                "Content-Type": mt.guess_type(filename)[0]
            },
            "body": content
        }
    except Exception as e:
        return {
            "statusCode": "404",
            "headers": {},
            "body": f"File not found for {filename} - {e}"
        }