# Generated by Django 4.1.1 on 2023-10-20 17:41

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0010_internalorderhistory_remove_internalordermodel_date_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='InternalOrderHistory',
            new_name='InternalOrderHistoryModel',
        ),
    ]
