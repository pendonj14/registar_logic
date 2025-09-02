from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class StudentRequest(models.Model):
    name = models.CharField(max_length=100)
    request = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.request}"