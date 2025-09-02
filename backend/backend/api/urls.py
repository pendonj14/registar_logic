from django.urls import path
from .views import get_requests, create_request, manage_request, register_user, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('requests/', get_requests, name='get_requests'),  
    path('requests/create/', create_request, name='create_request'), 
    path('requests/<int:pk>/', manage_request, name='manage_request'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]