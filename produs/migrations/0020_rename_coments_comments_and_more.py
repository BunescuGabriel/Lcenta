# Generated by Django 4.2.1 on 2023-10-12 13:25

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('produs', '0019_coments'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Coments',
            new_name='Comments',
        ),
        migrations.RenameField(
            model_name='comments',
            old_name='coment',
            new_name='comment',
        ),
    ]
