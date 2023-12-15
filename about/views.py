from rest_framework import generics, status
from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from about.serializers import TerminiSerializer, ConditiiSerializer, DescriereSerializer, \
    ServiciSerializer
from about import models
from users.models import UserToken
from rest_framework.exceptions import PermissionDenied
from django.http import Http404
from rest_framework.response import Response
from rest_framework.generics import  get_object_or_404


class ViewTermini(ListCreateAPIView):
    queryset = models.Termini.objects.all()
    serializer_class = TerminiSerializer


class CreateTermini(ListCreateAPIView):
    queryset = models.Termini.objects.all()
    serializer_class = TerminiSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți crea termini după ce ați făcut logout.")

            # Verificați dacă utilizatorul are is_superuser mai mare ca 0
            if user.is_superuser > 0:
                # Înlocuiți valoarea textului doar dacă există în datele de intrare
                text_value = request.data.get('text', None)
                data = request.data.copy()
                if text_value is None:
                    data['text'] = None

                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                raise PermissionDenied("Nu aveți permisiunea de a crea termini.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Termini.DoesNotExist:
            raise Http404


class DeleteTermini(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Termini.objects.all()
    serializer_class = TerminiSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți șterge termenii după ce ați făcut logout.")

            if user.is_superuser > 0:
                instance.delete()
            else:
                raise PermissionDenied("Nu aveți permisiunea de a șterge termenii.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Termini.DoesNotExist:
            raise Http404


class ConditiiCreate(ListCreateAPIView):
    queryset = models.Conditii.objects.all()
    serializer_class = ConditiiSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți crea termini după ce ați făcut logout.")

            # Verificați dacă utilizatorul are is_superuser mai mare ca 0
            if user.is_superuser > 0:
                # Înlocuiți valoarea textului doar dacă există în datele de intrare
                text_value = request.data.get('text', None)
                data = request.data.copy()
                if text_value is None:
                    data['text'] = None

                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                raise PermissionDenied("Nu aveți permisiunea de a crea termini.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Conditii.DoesNotExist:
            raise Http404


class ConditiiView(ListAPIView):
    queryset = models.Conditii.objects.all()
    serializer_class = ConditiiSerializer


class DeleteConditii(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Conditii.objects.all()
    serializer_class = ConditiiSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți șterge conditiile după ce ați făcut logout.")

            if user.is_superuser > 0:
                instance.delete()
            else:
                raise PermissionDenied("Nu aveți permisiunea de a șterge conditiile.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Conditii.DoesNotExist:
            raise Http404


class DescriereCreate(ListCreateAPIView):
    queryset = models.Descrierii.objects.all()
    serializer_class = DescriereSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți crea descrieri după ce ați făcut logout.")

            # Verificați dacă utilizatorul are is_superuser mai mare ca 0
            if user.is_superuser > 0:
                return super().create(request, *args, **kwargs)
            else:
                raise PermissionDenied("Nu aveți permisiunea de a crea descrieri.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Descrierii.DoesNotExist:
            raise Http404


class DeleteDescriere(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Descrierii.objects.all()
    serializer_class = DescriereSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți șterge descrierea după ce ați făcut logout.")

            if user.is_superuser > 0:
                instance.delete()
            else:
                raise PermissionDenied("Nu aveți permisiunea de a șterge descrierea.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Descrierii.DoesNotExist:
            raise Http404


class ConditiiList(generics.RetrieveAPIView):
    serializer_class = ConditiiSerializer

    def get_queryset(self):
        return models.Conditii.objects.all()

    def get_object(self):
        condition_id = self.kwargs.get('condition_id')
        return get_object_or_404(self.get_queryset(), id=condition_id)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        descrierii = models.Descrierii.objects.filter(conditi=instance)
        serializer = self.serializer_class(instance)
        serialized_data = serializer.data
        serialized_data['descrierii'] = DescriereSerializer(descrierii, many=True).data
        return Response(serialized_data)


class ServiciiView(ListCreateAPIView):
    queryset = models.Servici.objects.all()
    serializer_class = ServiciSerializer


class ServiciiCreate(ListCreateAPIView):
    queryset = models.Servici.objects.all()
    serializer_class = ServiciSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți crea descrieri după ce ați făcut logout.")

            # Verificați dacă utilizatorul are is_superuser mai mare ca 0
            if user.is_superuser > 0:
                return super().create(request, *args, **kwargs)
            else:
                raise PermissionDenied("Nu aveți permisiunea de a crea descrieri.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Servici.DoesNotExist:
            raise Http404


class DeleteServicii(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Servici.objects.all()
    serializer_class = ServiciSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți șterge descrierea după ce ați făcut logout.")

            if user.is_superuser > 0:
                instance.delete()
            else:
                raise PermissionDenied("Nu aveți permisiunea de a șterge descrierea.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Servici.DoesNotExist:
            raise Http404



from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def send_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        name = data.get('name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        message = data.get('message', '')

        try:
            send_mail(
                f'Mesaj nou de la {name}',
                f'Nume: {name}\nEmail: {email}\nTelefon: {phone}\nMesaj: {message}',
                'a0b68cb239e6d6',  # Adresa ta de email Gmail
                ['a0b68cb239e6d6'],  # Lista de destinatari
                fail_silently=False,
            )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'error': 'Metoda incorectă. Se așteaptă o cerere POST.'})


