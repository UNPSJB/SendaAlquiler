# Generated by Django 4.2.7 on 2024-03-02 23:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_supplierorderlineitem_target_office_quantity_after_receive_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='supplierorderhistory',
            old_name='user',
            new_name='responsible_user',
        ),
    ]
