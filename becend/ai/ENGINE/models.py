from django.db import models

class History(models.Model):
    question = models.TextField()
    answer = models.TextField()
    standard = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)