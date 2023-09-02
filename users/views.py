from rest_framework import generics, permissions
from users import models, serializers
from helpers import permissions as helper_permissions
from rest_framework.response import Response


class UserList(generics.ListCreateAPIView):
    queryset = models.Users.objects.all()
    serializer_class = serializers.UserSerializer


class UserDetaliedView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Users.objects.all()
    serializer_class = serializers.UserSerializer


class AddressList(generics.ListCreateAPIView):
    queryset = models.Address.objects.all()
    serializer_class = serializers.AddressSerializer


class ProfilesList(generics.ListCreateAPIView):
    queryset = models.Profiles.objects.all()
    serializer_class = serializers.ProfilesSerializer
