# supremerentals.md

Supreme Rentals oferă servicii de închirieri auto în Bălți, Moldova.
Toate mașinile sunt în stare ideală pentru confortul dumneavoastră, 
punând accent pe calitate, siguranță și garanție. Compania operează 24/7, 
oferind detalii despre termeni și condiții de închiriere, precum și o prezentare 
generală a companiei.

## Tehnologii Utilizate

- **Back-end**: Django REST Framework (DRF)
- **Front-end**: React
- **Bază de date**: MariaDB

Pentru mai multe detalii, vizitați [Supreme Rentals](https://supremerentals.md).

## Instrucțiuni de pornire

Pentru a rula aplicația, urmează acești pași:

### Instalare
Instalează dependințele proiectului folosind pip:
```bash
pip install -r requirements.txt
```
### Realizare migrări
Aplică migrările definite în proiectul Django pentru a actualiza structura bazei de date:
```bash
python manage.py makemigrations
```
```bash
python manage.py migrate
```
### Pornirea serverului
Pentru a porni aplicația, rulează următoarea comandă:
```bash
python manage.py runserver
```
# Setările de E-mail

Pentru a configura trimiterea de e-mail-uri din aplicația Django, trebuie să adăugi următoarele setări în fișierul `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'exemplu@gmail.com'
EMAIL_HOST_PASSWORD = 'parola pentru aplicații'
```
Aceste setări specifică faptul că aplicația va utiliza serverul SMTP de la Gmail pentru a trimite e-mail-uri. Asigură-te că înlocuiești adresa de e-mail și parola cu cele reale pentru contul tău Gmail.
### Generarea de Parole de Aplicații pentru Conturile Google
Link-ul către pagina necesar: [Google App Passwords](https://myaccount.google.com/apppasswords?rapt=AEjHL4NnY5BETcFQLDGFz5s-GuhQe0eA0v6SDQDmZlBdOGYgreAulzeesSz44c6f2_vrVeRJinK6-WxEk3tcOg7Hyo6VuwgRdppUzTGh2gIbu-FeM4WDkHs)

Această pagină îți permite să generezi parole specifice aplicațiilor pentru a le utiliza în locul parolei contului tău principal Google. Această măsură este utilă pentru a îmbunătăți securitatea contului tău și pentru a limita accesul aplicațiilor la datele tale personale.