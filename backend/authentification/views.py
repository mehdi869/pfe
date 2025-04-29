from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
# Import SimpleJWT CBVs
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView 
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.http import JsonResponse
from .models import User
# Removed unused jwt import
# Removed unused settings import
# Removed unused ExpiredSignatureError, InvalidTokenError imports (handled by TokenError)
# Removed unused make_password import
from django.contrib.auth import authenticate
# Removed unused ValidationError, validate_email imports (handle in serializer)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics # Import generics
# Removed unused require_GET decorator
from api.serializers import UserSerializer # Assuming UserSerializer exists and handles user creation

# --- Remove or Comment Out Old FBVs ---
# Remove UserLogin (commented out section)
# Remove SendCookies
# Remove GenereAccessToken
# Remove Register FBV
# Remove check_cookies
# Remove login_view FBV
# Remove logout_view FBV (will be replaced or kept)
# Remove verify_token_view FBV (will be replaced)
# Remove cookies FBV

# --- New Class-Based Views ---

# Optional: Customize TokenObtainPairView if needed (e.g., add user data to payload)
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
#         # Add custom claims
#         token['username'] = user.username
#         # ...
#         return token
#
# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer
#     # No need to manually set cookies here, frontend handles tokens from response body

class RegisterView(generics.CreateAPIView):
    """
    Handles user registration.
    Uses UserSerializer (ensure it handles password hashing).
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer # Make sure this serializer handles password hashing correctly

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save() # Serializer's create method should handle user creation + password hashing
        
        # Generate tokens for the new user (auto-login)
        refresh = RefreshToken.for_user(user)
        
        # Return user data and tokens in the response body
        return Response({
            "user": serializer.data, # Return created user data (excluding password)
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "User registered successfully. Please login.", # Or redirect info if preferred
        }, status=status.HTTP_201_CREATED)


# Logout View (can remain FBV or become a simple CBV)
@api_view(['POST'])
@permission_classes([AllowAny]) # Allow anyone to logout
def logout_view(request):
    """
    Handles user logout. Attempts to blacklist refresh token if provided.
    Frontend is responsible for clearing stored tokens.
    """
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            # Note: Blacklisting requires setup in settings.py
            # INSTALLED_APPS = [..., 'rest_framework_simplejwt.token_blacklist', ...]
            # MIDDLEWARE = [...,]
            # SIMPLE_JWT = {..., 'BLACKLIST_AFTER_ROTATION': True, ...}
            # Run python manage.py migrate after adding to INSTALLED_APPS
        
        # Frontend must clear its stored tokens upon receiving this response
        response = Response({"detail": "Logout successful. Please clear your tokens."}, status=status.HTTP_200_OK)
        # Remove cookie deletion logic if not setting cookies anymore
        # response.delete_cookie("access_token") 
        # response.delete_cookie("refresh_token")
        return response
    except TokenError:
        return Response({"error": "Invalid refresh token provided."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Log the exception e
        return Response({"error": "An error occurred during logout."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Example Protected View (remains the same)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You have access to this protected endpoint!"}, status=status.HTTP_200_OK)

# Note: TokenVerifyView is imported directly in urls.py now
# Note: TokenRefreshView is imported directly in urls.py now
# Note: TokenObtainPairView is imported directly in urls.py now (or MyTokenObtainPairView if customized)
