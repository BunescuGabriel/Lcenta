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


# class ProfilesList(generics.ListCreateAPIView):
#     queryset = models.Profiles.objects.all()
#     serializer_class = serializers.ProfilesSerializer

from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from helpers.permissions import IsLoggedIn


class ProfilesList(generics.ListCreateAPIView):
    serializer_class = serializers.ProfilesSerializer
    permission_classes = [IsLoggedIn]

    def get_queryset(self):
        # Returnăm profilul utilizatorului autentificat, sau un QuerySet gol dacă nu există
        if self.request.user.is_authenticated:
            return models.Profiles.objects.filter(user=self.request.user)
        return models.Profiles.objects.none()

    def create(self, request, *args, **kwargs):
        # Verificăm dacă utilizatorul are deja un profil
        if self.get_queryset().exists():
            return Response({'detail': 'Utilizatorul are deja un profil.'}, status=status.HTTP_400_BAD_REQUEST)

        # Dacă utilizatorul nu are încă un profil, creăm unul nou
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)







