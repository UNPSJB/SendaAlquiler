# Generated by Django 4.1.1 on 2023-09-28 17:02

from django.db import migrations, models


def delete_all_clients(apps, schema_editor):
    ClientModel = apps.get_model("core", "ClientModel")
    ClientModel.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_suppliermodel"),
    ]

    operations = [
        migrations.RunPython(delete_all_clients),
        migrations.RemoveField(
            model_name="clientmodel",
            name="user",
        ),
        migrations.AddField(
            model_name="clientmodel",
            name="email",
            field=models.EmailField(
                default="example@gmail.com", max_length=254, unique=True
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="clientmodel",
            name="first_name",
            field=models.CharField(default="fulano", max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="clientmodel",
            name="last_name",
            field=models.CharField(default="mengano", max_length=100),
            preserve_default=False,
        ),
    ]
