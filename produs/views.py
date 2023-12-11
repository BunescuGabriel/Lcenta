from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.http import Http404
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Banner, Produs, Comments, Rating
from .serializers import BannerSerializer, ProdusSerializer, CommentsSerializer, RatingSerializer
from PIL import Image
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from users.models import UserToken
from rest_framework.exceptions import PermissionDenied


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
                # if img.width > 10000 or img.height > 10000:
                #     return Response({'banner': 'Image dimensions are too large'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'banner': 'Invalid image'}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(
            name_banner=name_banner,
            banner=banner
        )


class DeleteBanner(generics.RetrieveDestroyAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
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
        except Banner.DoesNotExist:
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
            existing_images = instance.images.all()

            uploaded_images = request.data.get('uploaded_images', [])

            for image in existing_images:
                if image not in uploaded_images:
                    image.delete()

            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteProdus(generics.RetrieveDestroyAPIView):
    queryset = Produs.objects.all()
    serializer_class = ProdusSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def perform_destroy(self, instance):
        instance.images.all().delete()
        instance.delete()

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
                raise PermissionDenied("Nu puteți adăuga comentarii după ce ați făcut logout.")
            serializer.save(user=user)
        except UserToken.DoesNotExist:
            raise PermissionDenied("Utilizatorul nu există sau a fost șters.")


class DeleteGetCommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
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
        except Comments.DoesNotExist:
            raise Http404

# class ListCreateCommentsView(generics.ListCreateAPIView):
#     queryset = Comments.objects.all()
#     serializer_class = CommentsSerializer
#
#     def get_queryset(self):
#         produs_id = self.kwargs['produs_id']
#         return Comments.objects.filter(produs_id=produs_id)
#
#     def perform_create(self, serializer):
#         produs_id = self.kwargs['produs_id']
#         serializer.save(produs_id=produs_id)


class ProductCommentsView(generics.ListAPIView):
    serializer_class = CommentsSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']

        return Comments.objects.filter(produs_id=product_id)


class CreateRatingView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        user_token = UserToken.objects.filter(user=user).first()
        if user_token and user_token.logout_time is not None:
            raise PermissionDenied("Nu puteți adăuga comentarii după ce ați făcut logout.")

        #
        produs = serializer.validated_data.get('produs')
        existing_rating = Rating.objects.filter(user=user, produs=produs).first()
        if existing_rating:
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
        produs_id = self.kwargs['produs_id']
        return Rating.objects.filter(user=user, produs_id=produs_id).first()


class DeleteRatingView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
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
        except Rating.DoesNotExist:
            raise Http404


class ProductRatingsView(generics.ListAPIView):
    serializer_class = RatingSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']

        return Rating.objects.filter(produs_id=product_id)


# class ListCreateRatingView(generics.ListCreateAPIView):
#     queryset = Rating.objects.all()
#     serializer_class = RatingSerializer
#     # permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#         produs_id = self.kwargs['produs_id']
#         return Rating.objects.filter(produs_id=produs_id)
#
#     def perform_create(self, serializer):
#         produs_id = self.kwargs['produs_id']
#         serializer.save(produs_id=produs_id)

