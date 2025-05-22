from django.contrib import admin
from .models import User

admin.site.register(User)

# Admin panel endpoints
# show all users
# list_display = ('username', 'email', 'user_type')
# registre a new user
# update a user type (agent/admin)
# delete a user
# search for a user
