from django.urls import path
from .views import get_requests, create_request, manage_request, register_user, MyTokenObtainPairView, CurrentUserProfileView, verify_reset_credentials, reset_password_confirm
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('requests/', get_requests, name='get_requests'),  
    path('requests/create/', create_request, name='create_request'), 
    path('requests/<int:pk>/', manage_request, name='manage_request'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/profile/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('verify-reset-credentials/', verify_reset_credentials, name='verify_reset_credentials'),
    path('reset-password-confirm/', reset_password_confirm, name='reset_password_confirm'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)