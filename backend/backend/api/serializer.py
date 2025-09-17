from rest_framework import serializers
from .models import StudentRequest, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class StudentRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    birth_date = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentRequest
        fields = '__all__'
        
    def get_user_name(self, obj):
        return str(obj.user.profile)
        
    def get_birth_date(self, obj):
        return obj.user.profile.birth_date