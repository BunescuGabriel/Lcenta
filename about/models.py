from django.db import models
from phonenumber_field.modelfields import PhoneNumberField



class Termini(models.Model):

    titlu = models.TextField()
    descrierea = models.TextField()
    text = models.TextField(null=True)


class Conditii(models.Model):

    titlu = models.TextField()
    text = models.TextField(null=True)


class Descrierii(models.Model):
    conditi = models.ForeignKey(Conditii, on_delete=models.CASCADE)
    descrierea = models.TextField()


class DateContact(models.Model):
    addresa = models.TextField()
    email = models.EmailField(unique=True)
    phoneNumber = PhoneNumberField(unique=True, null=True)
    orar_lucru = models.CharField(max_length=255)


class LinguriRetele(models.Model):
    url_instagram = models.URLField()
    url_facebook = models.URLField()
    url_viber = models.URLField()


