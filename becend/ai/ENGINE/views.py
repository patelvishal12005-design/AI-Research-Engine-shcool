import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai
from google.genai import types

# સિક્યોરિટી માટે હવે આપણે આને Render માંથી ખેંચીશું (Env Variables)
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

@csrf_exempt
def upload_image(request):
    if request.method == "POST":
        image_file = request.FILES.get("image")
        standard = request.POST.get("standard")

        if not image_file:
            return JsonResponse({"error": "No image provided"}, status=400)

        image_data = image_file.read()
        mime_type = image_file.content_type if image_file.content_type else 'image/jpeg'

        prompt = f"""
        You are an expert school teacher and paper examiner.
        Read the entire exam paper image provided and extract ALL the questions visible in it.
        For each question extracted, provide a detailed, easy-to-understand answer suitable for a student in standard {standard}.
        
        Format your response beautifully using markdown:
        - Use ## Headings for each question.
        - First, write the exact question.
        - Then, provide a clear, step-by-step or detailed answer for that question.
        - Make sure you do not miss any question from the image.
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    types.Part.from_bytes(data=image_data, mime_type=mime_type),
                    prompt
                ]
            )

            answer = response.text

            return JsonResponse({
                "question": "Extracted from image by AI",
                "answer": answer
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def ask_ai(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            question = data.get("question")
            
            prompt = f"You are a very helpful and friendly school teacher. A student is asking you: {question}. Please reply in a simple, easy to understand way."

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return JsonResponse({"answer": response.text})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request"}, status=400)