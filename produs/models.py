import datetime
from django.db import models
from multiupload.fields import MultiFileField


class Banner(models.Model):

    name_banner = models.CharField(max_length=150, null=True)
    data = models.DateTimeField(auto_now_add=True, null=True)
    banner = models.ImageField(upload_to="banner/")


class Servicii(models.Model):

    name_servicii = models.CharField(max_length=150, null=True)
    data = models.DateTimeField(auto_now_add=True, null=True)
    servicii = models.ImageField(upload_to="servicii/", null=True)


class Produs(models.Model):
    name = models.CharField(max_length=150)
    producator = models.CharField(max_length=150)

    MANUAL = 0
    AUTOMAT = 1
    NOT_SPECIFIED_CUTIE = 2  # Redenumit pentru a evita redefinirea
    CUTIE_CHOICES = [
        (MANUAL, 'Manual'),
        (AUTOMAT, 'Automat'),
        (NOT_SPECIFIED_CUTIE, 'Not specified'),
    ]

    cutia = models.IntegerField(choices=CUTIE_CHOICES, default=NOT_SPECIFIED_CUTIE)

    DIESEL = 0
    PETROL = 1
    HYBRID = 2
    ELECTRIC = 3
    PETROL_HYBRID = 4
    PETROL_GAZ = 5
    NOT_SPECIFIED_MOTOR = 6  # Redenumit pentru a evita redefinirea
    MOTOR_CHOICES = [
        (DIESEL, 'Diesel'),
        (HYBRID, 'Hybrid'),
        (PETROL, 'Petrol'),
        (ELECTRIC, 'Electric'),
        (PETROL_HYBRID, 'Petrol-Hybrid'),
        (PETROL_GAZ, 'Petrol-Gaz'),
        (NOT_SPECIFIED_MOTOR, 'Not specified'),
    ]
    motor = models.IntegerField(choices=MOTOR_CHOICES, default=NOT_SPECIFIED_MOTOR)

    current_year = datetime.date.today().year
    start_year = 2000
    AN_CHOICES = [(year, str(year)) for year in range(start_year, current_year + 1)]
    an = models.IntegerField(choices=AN_CHOICES, default=current_year)

    TREI = 0
    CINCI = 1
    NOT_SPECIFIED_USI = 2  # Redenumit pentru a evita redefinirea
    USI_CHOICES = [
        (TREI, '3'),
        (CINCI, '5'),
        (NOT_SPECIFIED_USI, 'Not specified'),
    ]
    numar_usi = models.IntegerField(choices=USI_CHOICES, default=NOT_SPECIFIED_USI)

    DOI = 0
    PATRU = 1
    CINCI = 2
    SAPTE = 3
    NOT_SPECIFIED_PASAGERI = 4  # Redenumit pentru a evita redefinirea
    PASAGERI_CHOICES = [
        (DOI, '2'),
        (PATRU, '4'),
        (CINCI, '5'),
        (SAPTE, '7'),
        (NOT_SPECIFIED_PASAGERI, 'Not specified'),
    ]
    numar_pasageri = models.IntegerField(choices=PASAGERI_CHOICES, default=NOT_SPECIFIED_PASAGERI)

    Limita_de_KM = models.CharField(max_length=200, default='fără limită')
    descriere = models.TextField()

    VAN = 0
    UNIVERSAL = 1
    MINIVAN = 2
    ROADSTER = 3
    SUV = 4
    CABRIOLET = 5
    MICROVAN = 6
    PICKUP = 7
    SEDAN = 8
    CROSSOVER = 9
    HATCHBACK = 10
    COMBI = 11
    COUPE = 12
    NOT_SPECIFIED_CAROSERIE = 13  # Redenumit pentru a evita redefinirea
    CAROSERIE_CHOICES = [
        (VAN, 'Van'),
        (UNIVERSAL, 'Universal'),
        (MINIVAN, 'Minivan'),
        (ROADSTER, 'Roadster'),
        (SUV, 'SUV'),
        (CABRIOLET, 'Cabriolet'),
        (MICROVAN, 'Microvan'),
        (PICKUP, 'Pickup'),
        (SEDAN, 'Sedan'),
        (CROSSOVER, 'Crossover'),
        (HATCHBACK, 'Hatchback'),
        (COMBI, 'Combi'),
        (COUPE, 'Coupe'),
        (NOT_SPECIFIED_CAROSERIE, 'Not specified'),
    ]
    caroserie = models.IntegerField(choices=CAROSERIE_CHOICES, default=NOT_SPECIFIED_CAROSERIE)

    CAPACITATE_CHOICES = [(i / 10, str(i / 10)) for i in range(10, 41)]

    capacitate_cilindrica = models.FloatField(
        choices=CAPACITATE_CHOICES,
        default=1.0  # Valoarea implicită
    )


class Images(models.Model):
    produs = models.ForeignKey(Produs, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="car/", max_length=100, null=True, default='')

