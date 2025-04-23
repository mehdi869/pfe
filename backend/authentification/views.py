from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from .models import User
import jwt
from django.conf import settings
from jwt.exceptions import ExpiredSignatureError
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate 
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework.permissions import AllowAny

#récupére la data/génére  JWT/envoyer des cookies
@api_view(['POST'])
@permission_classes([AllowAny])
def UserLogin(request):
    #récupérer les informations de utilisateur
    username  = request.data.get("username")
    password =  request.data.get("password")
    #password_hash = make_password(str(password))
    
    user = authenticate(username = username,password = password)
    #si le user n'existe pas alors:
    if user is None:
        return JsonResponse({"resultat": "l'utilisateur n'existe pas"}, status=401)
    else:
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
        
    #  return JsonResponse({"resultat": "l'utilisateur n'existe pas"}, status=401)


#API de test
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




#générer access token lorsque il est expirer elle n'est pas utiliser pour l'instant
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



#API de registration
@api_view(["POST"])
@permission_classes([AllowAny])  # Add this line to allow unauthenticated access
def Register(request):
    
    FirstName = request.data.get("name")
    LastName = request.data.get("surname")
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")

    # Check for missing fields
    required_fields = [FirstName, LastName, email, username, password]
    if not all(required_fields):
        missing = [field_name for field, field_name in zip(required_fields, ["name", "surname", "email", "username", "password"]) if not field]
        return JsonResponse({"error": f"Missing required fields: {', '.join(missing)}"}, status=400)

    # Validate email format
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"error": "Invalid email format"}, status=400)

    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists. Please choose another username."}, status=409) # 409 Conflict

    # Check if email already exists
    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already exists. Please use another email."}, status=409) # 409 Conflict
    
    # If checks pass, create the user
    try:
        user = User.objects.create_user(first_name=FirstName, last_name=LastName, email=email, username=username, password=password)
        
        # Auto-login: Create tokens just like in the login function
        refresh = RefreshToken.for_user(user) 
        access = refresh.access_token 
        
        response = JsonResponse({
            "resultat": "User registered successfully.",
            "refresh": str(refresh),
            "access": str(access),
            "redirect": "/Dashboard"  # Add a redirect field that the frontend can use
        }, status=201)
        
        # Set cookies just like in the login function
        response.set_cookie(
            key = "access",
            value = str(access),
            httponly=True,
            secure=True,
            samesite="Strict"
        )

        response.set_cookie(
            key = "refresh",
            value = str(refresh),
            httponly=True,
            samesite="Strict",
            secure=True,  
        )
        
        return response
        
    except Exception as e:
        # Catch potential errors during user creation
        return JsonResponse({"error": f"An error occurred during registration: {str(e)}"}, status=500) # Internal Server Error
