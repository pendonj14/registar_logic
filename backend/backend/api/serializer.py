from rest_framework import serializers
from .models import StudentRequest 

class StudentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRequest
        fields = '__all__'