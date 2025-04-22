from django.urls import path
from . import views

urlpatterns = [
    path('data/', views.status),
    path('nps/', views.nps_score),
    path('age/',views.age_group)
] 