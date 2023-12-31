# Generated by Django 4.1.1 on 2023-10-03 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_clientmodel_dni_alter_clientmodel_phone_code_and_more'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='localitymodel',
            constraint=models.UniqueConstraint(fields=('name', 'postal_code', 'state'), name='unique_locality'),
        ),
    ]
