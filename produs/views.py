from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.http import Http404
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Banner, Servicii, Produs, Comments, Rating
from .serializers import BannerSerializer, ServiciiSerializer, ProdusSerializer, CommentsSerializer, RatingSerializer
from PIL import Image
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from users.models import  UserToken


class CreateBanner(generics.ListCreateAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

    def perform_create(self, serializer):
        data = serializer.validated_data
        name_banner = data.get('name_banner')
        banner = data.get('banner')

        if banner is not None:
            try:
                img = Image.open(banner)
                if img.format not in ('JPEG', 'PNG'):
                    return Response({'banner': 'Invalid image format'}, status=status.HTTP_400_BAD_REQUEST)
                if img.width > 1000 or img.height > 1000:
                    return Response({'banner': 'Image dimensions are too large'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'banner': 'Invalid image'}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(
            name_banner=name_banner,
            banner=banner
        )


class DeleteBanner(generics.RetrieveDestroyAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

    def perform_destroy(self, instance):
        instance.banner.delete()  # Șterge fișierul imagine asociat banner-ului
        instance.delete()  # Șterge obiectul banner din baza de date

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except ObjectDoesNotExist:
            raise Http404


class CreateServicii(generics.ListCreateAPIView):
    queryset = Servicii.objects.all()
    serializer_class = ServiciiSerializer

    def perform_create(self, serializer):
        data = serializer.validated_data
        name_servicii = data.get('name_servicii')
        servicii = data.get('servicii')

        if servicii is not None:
            try:
                img = Image.open(servicii)
                if img.format not in ('JPEG', 'PNG'):
                    return Response({'servicii': 'Invalid image format'}, status=status.HTTP_400_BAD_REQUEST)
                if img.width > 1000 or img.height > 1000:
                    return Response({'servicii': 'Image dimensions are too large'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'servicii': 'Invalid image'}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(
            name_servicii=name_servicii,
            servicii=servicii
        )


class UpdateServicii(generics.RetrieveUpdateAPIView):
    queryset = Servicii.objects.all()
    serializer_class = ServiciiSerializer

    def perform_update(self, serializer):
        data = serializer.validated_data
        name_servicii = data.get('name_servicii')

        if name_servicii is not None:
            serializer.instance.name_servicii = name_servicii

        # Verificați dacă câmpul "servicii" este furnizat în datele de intrare
        if 'servicii' in data:
            servicii = data['servicii']

            try:
                # Verificați dacă "servicii" este un fișier valid
                img = Image.open(servicii)
                if img.format not in ('JPEG', 'PNG'):
                    return Response({'servicii': 'Invalid image format'}, status=status.HTTP_400_BAD_REQUEST)
                if img.width > 1000 or img.height > 1000:
                    return Response({'servicii': 'Image dimensions are too large'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'servicii': 'Invalid image'}, status=status.HTTP_400_BAD_REQUEST)

            # Actualizați câmpul "servicii" doar dacă un fișier valid a fost furnizat
            serializer.instance.servicii = servicii

        serializer.save()

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except Servicii.DoesNotExist:
            raise Http404


class DeleteServicii(generics.RetrieveDestroyAPIView):
    queryset = Servicii.objects.all()
    serializer_class = ServiciiSerializer

    def perform_destroy(self, instance):
        instance.servicii.delete()  # Șterge fișierul imagine asociat banner-ului
        instance.delete()  # Șterge obiectul banner din baza de date

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except ObjectDoesNotExist:
            raise Http404


class CreateProdus(ListCreateAPIView):
    queryset = Produs.objects.all()
    serializer_class = ProdusSerializer


class UpdatePartialProdus(RetrieveUpdateAPIView):
    queryset = Produs.objects.all()
    serializer_class = ProdusSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            # Obțineți imaginile existente ale produsului
            existing_images = instance.images.all()

            # Obțineți imaginile încărcate în cerere (dacă există)
            uploaded_images = request.data.get('uploaded_images', [])

            # Ștergeți imaginile existente care nu sunt incluse în cerere
            for image in existing_images:
                if image not in uploaded_images:
                    image.delete()

            # Actualizați obiectul `Produs` folosind serializerul
            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteProdus(generics.RetrieveDestroyAPIView):
    queryset = Produs.objects.all()
    serializer_class = ProdusSerializer

    def get(self, request, *args, **kwargs):
        # Afișați detaliile produsului și imaginile asociate
        return self.retrieve(request, *args, **kwargs)

    def perform_destroy(self, instance):
        instance.images.all().delete()
        instance.delete() # Șterge obiectul banner din baza de date

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except ObjectDoesNotExist:
            raise Http404


class AddCommentView(generics.CreateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                # Utilizatorul a făcut logout, refuză adăugarea comentariilor
                raise PermissionDenied("Nu puteți adăuga comentarii după ce ați făcut logout.")
            serializer.save(user=user)
        except UserToken.DoesNotExist:
            raise PermissionDenied("Utilizatorul nu există sau a fost șters.")


class DeleteGetCommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer

    def perform_destroy(self, instance):
        instance.delete()

class ListCreateCommentsView(generics.ListCreateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        produs_id = self.kwargs['produs_id']
        return Comments.objects.filter(produs_id=produs_id)

    def perform_create(self, serializer):
        produs_id = self.kwargs['produs_id']
        serializer.save(produs_id=produs_id)


class ProductCommentsView(generics.ListAPIView):
    serializer_class = CommentsSerializer

    def get_queryset(self):
        # Obține id-ul produsului din cerere
        product_id = self.kwargs['product_id']

        # Returnează toate comentariile pentru produsul dat
        return Comments.objects.filter(produs_id=product_id)


class CreateRatingView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        # Verificați dacă utilizatorul a făcut logout
        user_token = UserToken.objects.filter(user=user).first()
        if user_token and user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți adăuga comentarii după ce ați făcut logout.")

        #
        produs = serializer.validated_data.get('produs')
        # Verificăm dacă utilizatorul a evaluat deja acest produs
        existing_rating = Rating.objects.filter(user=user, produs=produs).first()
        if existing_rating:
            # Utilizatorul a evaluat deja acest produs, așa că actualizăm ratingul existent
            existing_rating.rating = serializer.validated_data['rating']
            existing_rating.save()
        else:
            serializer.save(user=user)

class GetUserRatingView(generics.RetrieveAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Rating.objects.all()

    def get_object(self):
        user = self.request.user
        user_token = UserToken.objects.filter(user=user).first()
        if user_token and user_token.logout_time is not None:
            raise PermissionDenied("Nu puteți adăuga comentarii după ce ați făcut logout.")
        produs_id = self.kwargs['produs_id']  # Poate fi numele câmpului corect în funcție de cum e definit în model
        return Rating.objects.filter(user=user, produs_id=produs_id).first()

class DeleteRatingView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def perform_destroy(self, instance):
        instance.delete()


class ProductRatingsView(generics.ListAPIView):
    serializer_class = RatingSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']

        return Rating.objects.filter(produs_id=product_id)

class ListCreateRatingView(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        produs_id = self.kwargs['produs_id']
        return Rating.objects.filter(produs_id=produs_id)

    def perform_create(self, serializer):
        produs_id = self.kwargs['produs_id']
        serializer.save(produs_id=produs_id)

