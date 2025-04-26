from django.urls import path
from .views import login_view, check_cookies, GenereAccessToken, Register

urlpatterns = [
    path('login/', login_view, name='login'),
    path('cookies/', check_cookies, name='check_cookies'),
    # path('logout/', logout_view, name='logout'),
    path('refresh/',GenereAccessToken),
    path('register/',Register)
]