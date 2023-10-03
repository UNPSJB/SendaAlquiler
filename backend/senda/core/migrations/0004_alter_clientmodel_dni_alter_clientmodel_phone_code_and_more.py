# Generated by Django 4.1.1 on 2023-09-30 16:14

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_clientmodel_user_clientmodel_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientmodel',
            name='dni',
            field=models.CharField(help_text='Número de documento de identidad del cliente', max_length=20, unique=True, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')]),
        ),
        migrations.AlterField(
            model_name='clientmodel',
            name='phone_code',
            field=models.CharField(help_text='Código de área del teléfono del cliente', max_length=10, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')]),
        ),
        migrations.AlterField(
            model_name='clientmodel',
            name='phone_number',
            field=models.CharField(help_text='Número de teléfono del cliente', max_length=10, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')]),
        ),
        migrations.AlterField(
            model_name='localitymodel',
            name='postal_code',
            field=models.CharField(max_length=10),
        ),
    ]
