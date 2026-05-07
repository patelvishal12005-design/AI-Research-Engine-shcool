import requests

try:
    with open(r"c:\Users\Admin\Desktop\AI Research Engine\frantend\src\assets\hero.png", "rb") as f:
        res = requests.post("http://127.0.0.1:8000/upload/", files={"image": f}, data={"standard": "4"})
    print(res.status_code)
    with open("error.html", "wb") as f:
        f.write(res.content)

except Exception as e:
    print(e)
