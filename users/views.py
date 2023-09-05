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



from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import serializers, models


class ProfilesList(generics.ListCreateAPIView):
    serializer_class = serializers.ProfilesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return models.Profiles.objects.filter(user=self.request.user)
        return models.Profiles.objects.none()

    def create(self, request, *args, **kwargs):
        if self.get_queryset().exists():
            return Response({'detail': 'Utilizatorul are deja un profil.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, *args, **kwargs):
        # Obțineți profilul utilizatorului autentificat (dacă există)
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response({'detail': 'Profilul utilizatorului nu există.'}, status=status.HTTP_404_NOT_FOUND)

        profile = queryset.first()

        # Verificați dacă utilizatorul curent este proprietarul profilului
        if profile.user != request.user:
            return Response({'detail': 'Nu aveți permisiunea de a modifica acest profil.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Actualizați profilul cu datele din request
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)







