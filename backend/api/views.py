from django.shortcuts import render
from authentification.models import User  # Use your custom User model
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]