from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile') #butang nato student id
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    extension_name = models.CharField(max_length=10, blank=True, null=True)  # Jr., Sr., III, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    birth_date = models.DateField(blank=True, null=True)
    college_program = models.CharField(max_length=100, blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)  # Optional field for contact number

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
    affiliation = models.CharField(max_length=100, blank=True, null=True) #alumni or student
    created_at = models.DateTimeField(auto_now_add=True)

    #Part 1
    clearance_status = models.BooleanField(default=False)
    eclearance_proof = models.ImageField(upload_to='clearance_proofs/', blank=True, null=True)
    payment_proof = models.ImageField(upload_to='payment_proofs/', blank=True, null=True)
    is_graduate = models.BooleanField(default=False, blank=True, null=True)
    last_attended = models.CharField(max_length=100, blank=True, null=True)
    #Part 2
    request = models.CharField(max_length=999)

    #Part 3
    request_purpose = models.CharField(max_length=250, default="Not specified",)  # Providing a default value for existing records
    request_status = models.CharField(max_length=50, default="Pending")  # New field with default value
    claim_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.profile.first_name} {self.user.profile.last_name} - {self.request}"