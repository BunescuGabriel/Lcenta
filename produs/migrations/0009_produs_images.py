# Generated by Django 4.2.1 on 2023-10-11 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produs', '0008_produs_capacitate_cilindrica'),
    ]

    operations = [
        migrations.AddField(
            model_name='produs',
            name='images',
            field=models.FileField(default=1, upload_to='car/'),
            preserve_default=False,
        ),
    ]
