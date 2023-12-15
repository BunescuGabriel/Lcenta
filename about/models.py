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


class Servici(models.Model):
    serviciu = models.TextField()




