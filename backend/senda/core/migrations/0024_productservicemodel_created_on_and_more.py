# Generated by Django 4.1.1 on 2023-11-03 17:08

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0023_rename_servicemodel_productservicemodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='productservicemodel',
            name='created_on',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
        migrations.AddField(
            model_name='productservicemodel',
            name='modified_on',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
    ]