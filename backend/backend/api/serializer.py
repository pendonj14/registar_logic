from rest_framework import serializers
from .models import StudentRequest, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class StudentRequestSerializer(serializers.ModelSerializer):
    # These method fields calculate data for the frontend to DISPLAY
    user_name = serializers.SerializerMethodField()
    birth_date = serializers.SerializerMethodField()
    eclearance_proof_url = serializers.SerializerMethodField()
    payment_proof_url = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    contact_number = serializers.CharField(source='user.profile.contact_number', read_only=True)
    claim_date = serializers.DateTimeField(
        format="%m-%d-%Y - %I:%M %p",
        required=False,
        allow_null=True
    )
    # We define user explicitly as ReadOnly. 
    # This tells Django: "Don't expect the frontend to send the user ID."
    user = serializers.ReadOnlyField(source='user.username')
    email = serializers.EmailField(source='user.email', read_only=True)
    college_program = serializers.CharField(
    source='user.profile.college_program',
    required=False,
    allow_null=True
    )


    class Meta:
        model = StudentRequest
        fields = '__all__'
        # These fields are auto-generated or admin-controlled, so frontend cannot touch them
        read_only_fields = ['created_at', 'user']
        extra_kwargs = {
            'payment_proof': {'required': False, 'allow_null': True},
            'eclearance_proof': {'required': False, 'allow_null': True},
        }
        
    def get_user_name(self, obj):
        # Added safety: check if profile exists to prevent crash
        if hasattr(obj.user, 'profile'):
            return str(obj.user.profile)
        return obj.user.username
        
    def get_birth_date(self, obj):
        # Added safety check
        if hasattr(obj.user, 'profile'):
            return obj.user.profile.birth_date
        return None
    
    def get_eclearance_proof_url(self, obj):
        request = self.context.get('request')
        if obj.eclearance_proof:
            return request.build_absolute_uri(obj.eclearance_proof.url)
        return None
    
    def get_payment_proof_url(self, obj):
        request = self.context.get('request')
        # Check if the image exists before trying to get its URL
        if obj.payment_proof:
            return request.build_absolute_uri(obj.payment_proof.url)
        return None