from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'admin'

class IsAgent(permissions.BasePermission):
    """
    Custom permission to allow agent users to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'agent'
