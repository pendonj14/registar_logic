from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import StudentRequest, UserProfile
from .serializer import StudentRequestSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction #
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_requests(request):
    # Logic: If user is staff/admin, show all. If student, show only theirs.
    if request.user.is_staff:
        requests = StudentRequest.objects.all()
    else:
        requests = StudentRequest.objects.filter(user=request.user)
        
    serializer = StudentRequestSerializer(
    requests,
    many=True,
    context={'request': request}
)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_request(request): 
    serializer = StudentRequestSerializer(
    data=request.data,
    context={'request': request}
    )
    
    if serializer.is_valid():
        user = request.user

        # --- START NEW LOGIC: Update User Profile Program ---
        # 1. Get the new program from the form data
        new_program = request.data.get('college_program')
        
        # 2. Check if user has a profile and if the program actually changed
        if new_program and hasattr(user, 'profile'):
            profile = user.profile
            if profile.college_program != new_program:
                profile.college_program = new_program
                profile.save() # Save the change to the UserProfile table
        # --- END NEW LOGIC ---
        # Handle file upload for eclearance_proof if present
        eclearance_proof = request.FILES.get('eclearance_proof')
        
        if eclearance_proof:
            serializer.save(user=request.user, eclearance_proof=eclearance_proof)
        else:
            serializer.save(user=request.user)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH', 'DELETE'])
def manage_request(request, pk):
    try:
        student_request = StudentRequest.objects.get(pk=pk)
    except StudentRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # CHANGE 2: Check for both PUT and PATCH
    if request.method in ['PUT', 'PATCH']:
        serializer = StudentRequestSerializer(
            student_request,
            data=request.data,
            context={'request': request},
            # CHANGE 3: Enable partial updates if the method is PATCH
            partial=(request.method == 'PATCH')
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        student_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        with transaction.atomic():
            # Check if username already exists
            if User.objects.filter(username=data['username']).exists():
                return Response(
                    {'error': 'Username already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if email already exists
            if User.objects.filter(email=data['email']).exists():
                return Response(
                    {'error': 'Email already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate password
            try:
                validate_password(data['password'])
            except ValidationError as e:
                return Response(
                    {'error': e.messages}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create user
            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password'])
            )

            # Create user profile
            profile = UserProfile.objects.create(
                user=user,
                first_name=data['first_name'],
                middle_name=data.get('middle_name', ''),  # Optional
                last_name=data['last_name'],
                extension_name=data.get('extension_name', ''),  # Optional
                birth_date=data.get('birth_date'),  # Add this line
                college_program = data.get('college_program'),  # Optional, add program field
                contact_number=data.get('contact_number')
            )

            return Response({
                'message': 'User created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'profile': {
                        'first_name': profile.first_name,
                        'middle_name': profile.middle_name,
                        'last_name': profile.last_name,
                        'extension_name': profile.extension_name,
                        'birth_date': profile.birth_date,  # Add this line
                        'full_name': str(profile)
                    }
                }
            }, status=status.HTTP_201_CREATED)

    except KeyError as e:
        return Response({
            'error': f'Missing required field: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except IntegrityError as e:
        return Response({
            'error': 'Database error occurred'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
  
# --- NEW: STEP 1 - VERIFY CREDENTIALS ---
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_credentials(request):
    username = request.data.get('username')
    email = request.data.get('email')
    birth_date = request.data.get('birth_date')

    if not all([username, email, birth_date]):
        return Response({'error': 'All fields (Student ID, Email, Birth Date) are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 1. Find user by Student ID (username) and Email
        user = User.objects.get(username=username, email=email)
        
        # 2. Check if Birth Date matches the profile
        if hasattr(user, 'profile'):
            # Convert profile date to string to compare with input (YYYY-MM-DD)
            profile_dob = str(user.profile.birth_date)
            if profile_dob == birth_date:
                return Response({'message': 'Identity verified.'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Birth date does not match our records.'}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({'error': 'No account found with this Student ID and Email combination.'}, status=status.HTTP_400_BAD_REQUEST)


# --- NEW: STEP 2 - RESET PASSWORD ---
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request):
    username = request.data.get('username')
    email = request.data.get('email')
    birth_date = request.data.get('birth_date')
    new_password = request.data.get('new_password')

    if not all([username, email, birth_date, new_password]):
        return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 1. Re-verify identity (Security measure)
        user = User.objects.get(username=username, email=email)
        
        if not hasattr(user, 'profile') or str(user.profile.birth_date) != birth_date:
             return Response({'error': 'Verification failed. Cannot reset password.'}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Validate the new password
        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Save new password
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['program'] = user.profile.college_program
        token['name'] = str(user.profile)
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CurrentUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Check if profile exists
        if hasattr(user, 'profile'):
            profile = user.profile
            return Response({
                # This uses the same logic as your serializer (str representation)
                "full_name": str(profile), 
                "program": profile.college_program,
                "student_id": user.username,
                "email": user.email
            })
        return Response({
            "full_name": "Student",
            "program": "No Program",
            "student_id": user.username
        })