from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView 
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from django.http import JsonResponse
from .models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics 
from .serializers import UserSerializer 
from .serializers import MyTokenObtainPairSerializer 
from django.contrib.auth import get_user_model
from .permission import IsAdmin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "User registered successfully.",
        }, status=status.HTTP_201_CREATED)


class CustomTokenRefreshView(TokenRefreshView):
    """
    Overrides the default refresh to also return 'user' data.
    """
    def post(self, request, *args, **kwargs):
        # Call parent to get the new tokens
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Deserialize the provided refresh token
            raw_refresh = request.data.get("refresh")
            token = RefreshToken(raw_refresh)

            # Fetch and serialize the user
            user = User.objects.get(id=token["user_id"])
            user_data = UserSerializer(user).data

            # Inject into the JSON response
            response.data["user"] = user_data

        return response


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({"detail": "Logout successful. Please clear your tokens."}, status=status.HTTP_200_OK)
    except Exception:
        return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You have access to this protected endpoint!"}, status=status.HTTP_200_OK)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Admin Panel Views

from rest_framework.views import APIView

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        search = self.request.query_params.get('search')
        qs = super().get_queryset()
        if search:
            qs = qs.filter(username__icontains=search)
        return qs

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    lookup_field = 'pk'

    def partial_update(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    lookup_field = 'pk'
