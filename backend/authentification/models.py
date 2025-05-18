from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """username = models.CharField(max_length = 100)
    password = models.CharField(max_length = 100)"""
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('agent', 'Agent'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='agent')
    
    pass