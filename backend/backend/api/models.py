from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    extension_name = models.CharField(max_length=10, blank=True, null=True)  # Jr., Sr., III, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        full_name = f"{self.first_name} {self.middle_name or ''} {self.last_name}"
        if self.extension_name:
            full_name += f" {self.extension_name}"
        return full_name.strip()


class StudentRequest(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='requests',
    )
    
    year_level = models.CharField(max_length=50, blank=True, null=True)
    college = models.CharField(max_length=100, blank=True, null=True)
    program = models.CharField(max_length=100, blank=True, null=True)
    affiliation = models.CharField(max_length=100, blank=True, null=True)
    request = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.profile.first_name} {self.user.profile.last_name} - {self.request}"