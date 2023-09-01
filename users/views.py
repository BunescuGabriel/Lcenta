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

    def perform_create(self, serializer):
        serializer.save()

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)



class ProfilesList(generics.ListCreateAPIView):
    queryset = models.Profiles.objects.all()
    serializer_class = serializers.ProfilesSerializer

    def perform_create(self, serializer):
        # You can set user and address based on your requirements here
        user_id = self.request.data.get('user_id')
        address_id = self.request.data.get('address_id')
        serializer.save(user_id=user_id, address_id=address_id)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


