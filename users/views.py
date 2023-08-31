from rest_framework import generics, permissions
from users import models, serializers
from helpers import permissions as helper_permissions


class UserList(generics.ListCreateAPIView):
    queryset = models.Users.objects.all()
    serializer_class = serializers.UserSerializer


class UserDetaliedView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Users.objects.all()
    serializer_class = serializers.UserSerializer


class AddressList(generics.ListCreateAPIView):
    queryset = models.Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [helper_permissions.BlockAnonymousUser]
    # authentication_classes = [models.TokenAuthentication]


class ProfilesList(generics.ListCreateAPIView):
    queryset = models.Profiles.objects.all()
    serializer_class = serializers.ProfilesSerializer
