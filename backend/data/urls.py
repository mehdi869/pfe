from django.urls import path
from . import views

urlpatterns = [
    path('data/', views.status),
    path('nps/', views.nps_score),
    path('age/',views.age_group),
    path('city_pourcentage/',views.city_poursentage),
    path('city/', views.city),
    path('survey_1/',views.survey_1_nps),
    path('survey_2/',views.survey_2_nps),
    path('survey_3/',views.survey_3_nps),
    path('survey_4/',views.survey_4_nps),
    path('survey_5/',views.survey_5_nps),
    path('survey_6/',views.survey_6_nps),
    path('survey_8/',views.survey_8_nps),
    path('survey/',views.survey),

] 