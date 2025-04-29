# authentification/urls.py
from django.urls import path
from .views import login_view, logout_view, GenereAccessToken, Register, verify_token_view
from . import views

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('refresh/', GenereAccessToken, name='token_refresh'),
    path('register/', Register, name='register'),
    path('token/verify/', verify_token_view, name='token_verify'),
    path('cookies/', views.cookies, name='cookies'),
]