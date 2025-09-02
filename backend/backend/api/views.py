from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import StudentRequest
from .serializer import StudentRequestSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth.hashers import make_password


@api_view(['GET'])
def get_requests(request):
    requests = StudentRequest.objects.all()
    serializer = StudentRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_request(request):
    serializer = StudentRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def manage_request(request, pk):
    try:
        student_request = StudentRequest.objects.get(pk=pk)
    except StudentRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = StudentRequestSerializer(student_request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        student_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    except:
        return Response({'error': 'Unable to create user'}, status=status.HTTP_400_BAD_REQUEST)
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer