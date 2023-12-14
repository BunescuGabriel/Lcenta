from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from . import serializers, models
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View
from .models import Users, Profiles, Address, UserToken
from .serializers import AddressSerializer, ProfilesSerializer
from PIL import Image
from rest_framework.exceptions import PermissionDenied
from django.http import Http404


class UserList(generics.ListCreateAPIView):
    queryset = models.Users.objects.all()
    serializer_class = serializers.UserSerializer


class UserDetaliedView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Users.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți șterge bannere după ce ați făcut logout.")

            # Verificați dacă utilizatorul are is_superuser mai mare ca 0
            if user.is_superuser > 0:
                instance.delete()  # Șterge banner-ul
            else:
                raise PermissionDenied("Nu aveți permisiunea de a șterge bannere.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except Users.DoesNotExist:
            raise Http404


class GetUserIDByEmailView(View):
    def get(self, request, email):
        try:
            user = get_object_or_404(Users, email=email)
            return JsonResponse({'user_id': user.id, 'is_superuser': user.is_superuser})
        except Users.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)


class CreateAddress(generics.CreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

    def perform_create(self, serializer):
        # Verificați care dintre câmpuri are valori și setați celelalte ca "None" (null)
        data = serializer.validated_data
        country = data.get('country')
        city = data.get('city')
        street = data.get('street')
        house_number = data.get('house_number')
        apartment = data.get('apartment')

        if not any([country, city, street, house_number, apartment]):
            # Dacă niciun câmp nu are valoare, setați-le pe toate ca "None"
            serializer.save(country=None, city=None, street=None, house_number=None, apartment=None)
        else:
            # Setați valorile furnizate și celelalte ca "None"
            serializer.save(
                country=country,
                city=city,
                street=street,
                house_number=house_number,
                apartment=apartment
            )


class AddressList(generics.ListCreateAPIView):
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return models.Address.objects.filter(user=self.request.user)
        return models.Address.objects.none()

    def patch(self, request, *args, **kwargs):
        # Obțineți profilul utilizatorului autentificat (dacă există)
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response({'detail': 'Address utilizatorului nu există.'}, status=status.HTTP_404_NOT_FOUND)

        address = queryset.first()

        # Verificați dacă utilizatorul curent este proprietarul profilului
        if address.user != request.user:
            return Response({'detail': 'Nu aveți permisiunea de a modifica acest profil.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Actualizați profilul cu datele din request
        serializer = self.get_serializer(address, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateProfile(generics.CreateAPIView):
    queryset = Profiles.objects.all()
    serializer_class = ProfilesSerializer

    def perform_create(self, serializer):
        data = serializer.validated_data
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        phoneNumber = data.get('phoneNumber')
        birthday = data.get('birthday')
        gender = data.get('gender')
        avatar = data.get('avatar')

        # Verificăm dacă 'gender' este o valoare validă
        if gender not in [choice[0] for choice in Profiles.GENDER_CHOICES]:
            return Response({'gender': 'Invalid gender value'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificăm dacă 'avatar' este o imagine validă
        if avatar is not None:
            try:
                # Deschide imaginea folosind PIL pentru a verifica validitatea
                img = Image.open(avatar)
                # Verifică dacă imaginea este într-un format acceptat, de exemplu, JPEG sau PNG
                if img.format not in ('JPEG', 'PNG'):
                    return Response({'avatar': 'Invalid image format'}, status=status.HTTP_400_BAD_REQUEST)
                # Verifică dacă dimensiunile imaginii sunt acceptabile (poți seta limitele aici)
                if img.width > 1000 or img.height > 1000:
                    return Response({'avatar': 'Image dimensions are too large'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                # Dacă apar erori la deschiderea sau verificarea imaginii, returnează o eroare
                return Response({'avatar': 'Invalid image'}, status=status.HTTP_400_BAD_REQUEST)

        # Setăm valorile furnizate și celelalte ca "None"
        serializer.save(
            first_name=first_name,
            last_name=last_name,
            phoneNumber=phoneNumber,
            birthday=birthday,
            gender=gender,
            avatar=avatar
        )


class ProfilesList(generics.ListCreateAPIView):
    serializer_class = serializers.ProfilesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return models.Profiles.objects.filter(user=self.request.user)
        return models.Profiles.objects.none()

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


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = ProfilesSerializer

    def retrieve(self, request, user_id):
        try:
            profile = Profiles.objects.get(user_id=user_id)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except Profiles.DoesNotExist:
            return Response({'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)