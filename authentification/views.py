import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import User
import jwt
from django.conf import settings
from jwt.exceptions import ExpiredSignatureError

#récupére la data/génére  JWT/envoyer des cookies
@api_view(['POST'])
def UserLogin(request):
    #récupérer les informations de utilisateur
    username  = request.data.get("username")
    password =  request.data.get("password")
    
    
    user = user = User.objects.filter(username = username,password = password).first()
    #si le user existe alors:
    if user:
        #créer les token 
        refresh = RefreshToken.for_user(user) 
        access = refresh.access_token 
        response = JsonResponse({
            "refresh": str(refresh),
            "access": str(access),
           })
        
        #envoyer le token dans des cookies
        response.set_cookie(
            key = "access",
            value = str(access),
            httponly=True,  # Empêche JavaScript d'y accéder
            secure=True,    # Activer en production (HTTPS)
            samesite="Strict"  # Empêche l'accès depuis d'autres sites (CSRF protection)
        )

        response.set_cookie(
            key = "refresh",
            value = str(refresh),
            httponly=True,
            samesite="Strict",
            secure=True,  
        )
        
        return response
        
    return JsonResponse({"resultat": "not found"}, status=401)


@api_view(["POST"])
def SendCookies(request):
    AccessCook = request.COOKIES.get("access")
    RefreshCook = request.COOKIES.get("refresh")
      
    if(AccessCook and RefreshCook):
        
        try:
            access = jwt.decode(AccessCook, settings.SECRET_KEY, algorithms=['HS256'])

            return JsonResponse({
               "expire" : str(access['exp']),
              })
        except ExpiredSignatureError:
            return JsonResponse({
                "resultat" : "the token has expired",
             })
             
    return JsonResponse({"resultat" : "failed cookies"})


@api_view(["POST"])
def GenereAccessToken(request):

    refresh = request.COOKIES.get("refresh")
    
    try:
        refreshToken = RefreshToken(refresh)
        accesstoken = refreshToken.access_token
         
        response = JsonResponse({
        "access" : str(accesstoken)
        })

        response.set_cookie(
            key = "access",
            value = str(accesstoken),
            httponly = True,
            secure = True,
            samesite = "Strict", 
        )
        return response
    except Exception:
        return JsonResponse({"resultat" : "the refresh token is expired"})
