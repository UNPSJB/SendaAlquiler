# Generated by Django 4.2.7 on 2024-01-11 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0045_remove_rentalcontractitemmodel_service_total'),
    ]

    operations = [
        migrations.AddField(
            model_name='rentalcontractitemmodel',
            name='discount',
            field=models.IntegerField(default=0),
        ),
    ]