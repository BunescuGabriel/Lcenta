from rest_framework import permissions


class BlockAnonymousUser(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_anonymous:
            if request.method in permissions.SAFE_METHODS:
                return True
            return False


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return False
