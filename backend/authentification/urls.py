from django.urls import path
from .views import RegisterView, logout_view, protected_view, MyTokenObtainPairView, get_user_details
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', logout_view, name='logout'),
    path('whoami/', get_user_details, name='whoami'),
    path('protected/', protected_view, name='protected_example'),
]