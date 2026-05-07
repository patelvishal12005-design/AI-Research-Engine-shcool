"""
URL configuration for ai project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.http import JsonResponse
from ENGINE.views import upload_image, ask_ai

def api_root(request):
    return JsonResponse({"message": "AI Research Engine API is running. Please use the React frontend."})

urlpatterns = [
    path("", api_root),
    path("upload/", upload_image),
    path("ask/", ask_ai),
]
