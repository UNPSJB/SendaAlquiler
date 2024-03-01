# Generated by Django 4.2.7 on 2024-03-01 01:30

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Brand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('house_number', models.CharField(help_text='Número de la calle donde vive el cliente', max_length=10)),
                ('street_name', models.CharField(help_text='Nombre de la calle donde vive el cliente', max_length=255)),
                ('house_unit', models.CharField(blank=True, help_text='Número de la casa o departamento', max_length=10, null=True)),
                ('dni', models.CharField(help_text='Número de documento de identidad del cliente', max_length=20, unique=True, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')])),
                ('phone_code', models.CharField(help_text='Código de área del teléfono del cliente', max_length=10, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')])),
                ('phone_number', models.CharField(help_text='Número de teléfono del cliente', max_length=10, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')])),
                ('note', models.TextField(blank=True, help_text='Notas adicionales sobre el cliente', null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('expiration_date', models.DateTimeField(blank=True, null=True)),
                ('contract_start_datetime', models.DateTimeField()),
                ('contract_end_datetime', models.DateTimeField()),
                ('house_number', models.CharField(help_text='Número de la calle donde vive el cliente', max_length=10)),
                ('street_name', models.CharField(help_text='Nombre de la calle donde vive el cliente', max_length=255)),
                ('house_unit', models.CharField(blank=True, help_text='Número de la casa o departamento', max_length=10, null=True)),
                ('number_of_rental_days', models.PositiveIntegerField()),
                ('subtotal', models.PositiveBigIntegerField(default=0)),
                ('discount_amount', models.PositiveBigIntegerField(default=0)),
                ('total', models.PositiveBigIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Rental Contract',
                'verbose_name_plural': 'Rental Contracts',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ContractHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('status', models.CharField(choices=[('PRESUPUESTADO', 'PRESUPUESTADO'), ('CON_DEPOSITO', 'SEÑADO'), ('PAGADO', 'PAGADO'), ('CANCELADO', 'CANCELADO'), ('ACTIVO', 'ACTIVO'), ('VENCIDO', 'VENCIDO'), ('FINALIZADO', 'FINALIZADO'), ('DEVOLUCION_EXITOSA', 'DEVOLUCION EXITOSA'), ('DEVOLUCION_FALLIDA', 'DEVOLUCION FALLIDA')], max_length=50)),
            ],
            options={
                'verbose_name': 'Rental Contract History',
                'verbose_name_plural': 'Rental Contract Histories',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ContractItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('product_price', models.PositiveBigIntegerField(default=0)),
                ('quantity', models.PositiveIntegerField(default=0)),
                ('quantity_returned', models.PositiveIntegerField(default=0)),
                ('product_subtotal', models.PositiveBigIntegerField(default=0)),
                ('services_subtotal', models.PositiveIntegerField(default=0)),
                ('shipping_subtotal', models.PositiveIntegerField(default=0)),
                ('product_discount', models.PositiveBigIntegerField(default=0)),
                ('services_discount', models.PositiveBigIntegerField(default=0)),
                ('shipping_discount', models.PositiveBigIntegerField(default=0)),
                ('total', models.PositiveBigIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Rental Contract Item',
                'verbose_name_plural': 'Rental Contract Items',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ContractItemProductAllocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('shipping_cost', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ContractItemService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('price', models.PositiveBigIntegerField(default=0)),
                ('discount', models.PositiveBigIntegerField(default=0)),
                ('subtotal', models.PositiveBigIntegerField(default=0)),
                ('total', models.PositiveBigIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='EmployeeModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='EmployeeOffice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InternalOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('requested_for_date', models.DateField(blank=True, null=True)),
                ('approximate_delivery_date', models.DateField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InternalOrderHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('status', models.CharField(choices=[('PENDING', 'Pendiente'), ('IN_PROGRESS', 'En progreso'), ('COMPLETED', 'Completado'), ('CANCELED', 'Cancelado')], max_length=20)),
                ('note', models.TextField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InternalOrderLineItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('quantity_ordered', models.PositiveIntegerField(default=0)),
                ('quantity_received', models.PositiveIntegerField(default=0)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LocalityModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('name', models.CharField(max_length=255)),
                ('postal_code', models.CharField(max_length=10)),
                ('state', models.CharField(choices=[('BUENOS_AIRES', 'BUENOS_AIRES'), ('CATAMARCA', 'CATAMARCA'), ('CHACO', 'CHACO'), ('CHUBUT', 'CHUBUT'), ('CORDOBA', 'CORDOBA'), ('CORRIENTES', 'CORRIENTES'), ('ENTRE_RIOS', 'ENTRE_RIOS'), ('FORMOSA', 'FORMOSA'), ('JUJUY', 'JUJUY'), ('LA_PAMPA', 'LA_PAMPA'), ('LA_RIOJA', 'LA_RIOJA'), ('MENDOZA', 'MENDOZA'), ('MISIONES', 'MISIONES'), ('NEUQUEN', 'NEUQUEN'), ('RIO_NEGRO', 'RIO_NEGRO'), ('SALTA', 'SALTA'), ('SAN_JUAN', 'SAN_JUAN'), ('SAN_LUIS', 'SAN_LUIS'), ('SANTA_CRUZ', 'SANTA_CRUZ'), ('SANTA_FE', 'SANTA_FE'), ('SANTIAGO_DEL_ESTERO', 'SANTIAGO_DEL_ESTERO'), ('TIERRA_DEL_FUEGO', 'TIERRA_DEL_FUEGO'), ('TUCUMAN', 'TUCUMAN')], max_length=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Office',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('name', models.CharField(max_length=255)),
                ('street', models.CharField(max_length=20)),
                ('house_number', models.CharField(max_length=10)),
                ('note', models.CharField(blank=True, max_length=255, null=True)),
                ('locality', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.localitymodel')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('sku', models.CharField(blank=True, db_index=True, max_length=10, null=True, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('type', models.CharField(choices=[('ALQUILABLE', 'ALQUILABLE'), ('COMERCIABLE', 'COMERCIABLE')], max_length=50)),
                ('price', models.IntegerField(blank=True, null=True)),
                ('brand', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='products', to='core.brand')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('subtotal', models.PositiveBigIntegerField(default=0)),
                ('discount', models.PositiveBigIntegerField(default=0)),
                ('total', models.PositiveBigIntegerField(default=0)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sales', to='core.client')),
                ('office', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sales', to='core.office')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SupplierModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('cuit', models.CharField(max_length=12)),
                ('name', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('house_number', models.CharField(help_text='Número de la calle donde vive el proveedor', max_length=10)),
                ('street_name', models.CharField(help_text='Nombre de la calle donde vive el proveedor', max_length=255)),
                ('house_unit', models.CharField(blank=True, help_text='Número de la casa o departamento', max_length=10, null=True)),
                ('phone_code', models.CharField(help_text='Código de área del teléfono del proveedor', max_length=10, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')])),
                ('phone_number', models.CharField(help_text='Número de teléfono del proveedor', max_length=10, validators=[django.core.validators.RegexValidator(message='Solo se permiten dígitos.', regex='^\\d+$')])),
                ('note', models.TextField(blank=True, null=True)),
                ('locality', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='suppliers', to='core.localitymodel')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SupplierOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('requested_for_date', models.DateField(blank=True, null=True)),
                ('approximate_delivery_date', models.DateField(blank=True, null=True)),
                ('total', models.PositiveBigIntegerField(default=0)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SupplierOrderLineItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('quantity_ordered', models.PositiveIntegerField(default=0)),
                ('quantity_received', models.PositiveIntegerField(default=0)),
                ('product_price', models.PositiveBigIntegerField(blank=True)),
                ('total', models.PositiveBigIntegerField(blank=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related_supplier_orders', to='core.product')),
                ('supplier_order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='core.supplierorder')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SupplierOrderHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('status', models.CharField(choices=[('PENDING', 'Pendiente'), ('IN_PROGRESS', 'En progreso'), ('COMPLETED', 'Completado'), ('CANCELED', 'Cancelado')], max_length=20)),
                ('supplier_order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history_entries', to='core.supplierorder')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='supplier_order_histories', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='supplierorder',
            name='latest_history_entry',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='current_order', to='core.supplierorderhistory'),
        ),
        migrations.AddField(
            model_name='supplierorder',
            name='supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outgoing_supplier_orders', to='core.suppliermodel'),
        ),
        migrations.AddField(
            model_name='supplierorder',
            name='target_office',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='incoming_supplier_orders', to='core.office'),
        ),
        migrations.CreateModel(
            name='StockItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('quantity', models.PositiveIntegerField()),
                ('office', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock_items', to='core.office')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock_items', to='core.product')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SaleItemModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('product_price', models.PositiveBigIntegerField()),
                ('quantity', models.IntegerField(default=0)),
                ('subtotal', models.PositiveBigIntegerField(default=0)),
                ('discount', models.PositiveBigIntegerField(default=0)),
                ('total', models.PositiveBigIntegerField(default=0)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_items', to='core.product')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_items', to='core.sale')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ProductSupplier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('price', models.IntegerField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='suppliers', to='core.product')),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='core.suppliermodel')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ProductService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_on', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('name', models.CharField(max_length=100)),
                ('price', models.IntegerField()),
                ('billing_type', models.CharField(choices=[('ONE_TIME', 'ONE_TIME'), ('WEEKLY', 'WEEKLY'), ('MONTHLY', 'MONTHLY'), ('CUSTOM', 'CUSTOM')], max_length=50)),
                ('billing_period', models.PositiveIntegerField(blank=True, help_text='Periodo de facturación en días', null=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='services', to='core.product')),
            ],
            options={
                'verbose_name': 'Service',
                'verbose_name_plural': 'Services',
                'abstract': False,
            },
        ),
        migrations.AddConstraint(
            model_name='localitymodel',
            constraint=models.UniqueConstraint(fields=('name', 'postal_code', 'state'), name='unique_locality'),
        ),
        migrations.AddField(
            model_name='internalorderlineitem',
            name='internal_order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='core.internalorder'),
        ),
        migrations.AddField(
            model_name='internalorderlineitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='internal_orders', to='core.product'),
        ),
        migrations.AddField(
            model_name='internalorderhistory',
            name='internal_order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history_entries', to='core.internalorder'),
        ),
        migrations.AddField(
            model_name='internalorderhistory',
            name='responsible_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='internal_order_histories', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='internalorder',
            name='contract_item_product_allocation',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='internal_order', to='core.contractitemproductallocation'),
        ),
        migrations.AddField(
            model_name='internalorder',
            name='latest_history_entry',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='current_order', to='core.internalorderhistory'),
        ),
        migrations.AddField(
            model_name='internalorder',
            name='source_office',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outgoing_internal_orders', to='core.office'),
        ),
        migrations.AddField(
            model_name='internalorder',
            name='target_office',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='incoming_internal_orders', to='core.office'),
        ),
        migrations.AddField(
            model_name='employeeoffice',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offices', to='core.employeemodel'),
        ),
        migrations.AddField(
            model_name='employeeoffice',
            name='office',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employees', to='core.office'),
        ),
        migrations.AddField(
            model_name='employeemodel',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='employee', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='contractitemservice',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='service_items', to='core.contractitem'),
        ),
        migrations.AddField(
            model_name='contractitemservice',
            name='service',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contract_items', to='core.productservice'),
        ),
        migrations.AddField(
            model_name='contractitemproductallocation',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='allocations', to='core.contractitem'),
        ),
        migrations.AddField(
            model_name='contractitemproductallocation',
            name='office',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contract_items_allocations', to='core.office'),
        ),
        migrations.AddField(
            model_name='contractitem',
            name='contract',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contract_items', to='core.contract'),
        ),
        migrations.AddField(
            model_name='contractitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contract_items', to='core.product'),
        ),
        migrations.AddField(
            model_name='contracthistory',
            name='contract',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='core.contract'),
        ),
        migrations.AddField(
            model_name='contract',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to='core.client'),
        ),
        migrations.AddField(
            model_name='contract',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts_created', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='contract',
            name='latest_history_entry',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='current_contract', to='core.contracthistory'),
        ),
        migrations.AddField(
            model_name='contract',
            name='locality',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to='core.localitymodel'),
        ),
        migrations.AddField(
            model_name='contract',
            name='office',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to='core.office'),
        ),
        migrations.AddField(
            model_name='client',
            name='locality',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='clients', to='core.localitymodel'),
        ),
        migrations.AddField(
            model_name='adminmodel',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='admin', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='supplierorderlineitem',
            constraint=models.UniqueConstraint(fields=('product', 'supplier_order'), name='order_supplier_unique_product'),
        ),
        migrations.AddConstraint(
            model_name='supplierorderlineitem',
            constraint=models.CheckConstraint(check=models.Q(('quantity_received__gte', 0)), name='order_supplier_quantity_received_must_be_positive'),
        ),
        migrations.AddConstraint(
            model_name='supplierorderlineitem',
            constraint=models.CheckConstraint(check=models.Q(('quantity_received__lte', models.F('quantity_ordered'))), name='order_supplier_quantity_received_must_be_lte_to_quantity'),
        ),
        migrations.AddConstraint(
            model_name='stockitem',
            constraint=models.UniqueConstraint(fields=('office', 'product'), name='unique_stock'),
        ),
        migrations.AddConstraint(
            model_name='productservice',
            constraint=models.UniqueConstraint(fields=('product', 'name'), name='unique_service_name_by_product'),
        ),
        migrations.AddConstraint(
            model_name='productservice',
            constraint=models.CheckConstraint(check=models.Q(('price__gte', 0)), name='price_gte_0'),
        ),
        migrations.AddConstraint(
            model_name='product',
            constraint=models.CheckConstraint(check=models.Q(('price__gte', 0)), name='price_must_be_greater_than_0'),
        ),
        migrations.AddConstraint(
            model_name='internalorderlineitem',
            constraint=models.UniqueConstraint(fields=('product', 'internal_order'), name='internal_order_unique_product'),
        ),
        migrations.AddConstraint(
            model_name='internalorderlineitem',
            constraint=models.CheckConstraint(check=models.Q(('quantity_received__gte', 0)), name='internal_order_quantity_received_must_be_positive'),
        ),
        migrations.AddConstraint(
            model_name='internalorderlineitem',
            constraint=models.CheckConstraint(check=models.Q(('quantity_received__lte', models.F('quantity_ordered'))), name='internal_order_quantity_received_must_be_lte_to_quantity'),
        ),
        migrations.AddConstraint(
            model_name='contractitemservice',
            constraint=models.UniqueConstraint(fields=('item', 'service'), name='unique_contract_item_service'),
        ),
        migrations.AddConstraint(
            model_name='contractitemproductallocation',
            constraint=models.UniqueConstraint(fields=('item', 'office'), name='unique_contract_item_allocation_per_office'),
        ),
        migrations.AddConstraint(
            model_name='contractitem',
            constraint=models.UniqueConstraint(fields=('contract', 'product'), name='unique_contract_item'),
        ),
        migrations.AddConstraint(
            model_name='contractitem',
            constraint=models.CheckConstraint(check=models.Q(('quantity__gte', 1)), name='quantity_must_be_greater_than_0'),
        ),
        migrations.AddConstraint(
            model_name='contractitem',
            constraint=models.CheckConstraint(check=models.Q(('quantity_returned__lte', models.F('quantity'))), name='quantity_returned_must_be_lte_quantity'),
        ),
    ]
