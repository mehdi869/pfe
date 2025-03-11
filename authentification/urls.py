from django.urls import path
from . import views
urlpatterns = [
  path('login/',views.UserLogin),
  path('cookies/',views.SendCookies ),
  path('refresh/',views.GenereAccessToken)
]