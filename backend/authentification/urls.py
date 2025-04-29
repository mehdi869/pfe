# authentification/urls.py
from django.urls import path
# Import the CBVs from views and simplejwt
from .views import RegisterView, logout_view, protected_view # Import your custom views
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # Use standard or your custom MyTokenObtainPairView
    TokenRefreshView,
    TokenVerifyView,
)
# Remove imports for old views like login_view, GenereAccessToken, Register, verify_token_view

urlpatterns = [
    # Use standard TokenObtainPairView or your custom one if created
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Standard login
    path('logout/', logout_view, name='logout'), # Keep FBV or use LogoutView.as_view() if created
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Standard refresh
    path('register/', RegisterView.as_view(), name='register'), # New Register CBV
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'), # Standard verify
    path('protected/', protected_view, name='protected_example'), # Example protected route
    
]