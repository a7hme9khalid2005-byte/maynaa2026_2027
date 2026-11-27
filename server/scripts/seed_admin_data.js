const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Admin Real Database Seeding ---');

  // 1. Platform Config & Gateways
  await prisma.platformConfig.upsert({
    where: { id: 'global-config' },
    update: {
      commissionSea: 2.5,
      commissionAir: 3.0,
      commissionLand: 1.5,
      commissionCustom: 1.0,
      vatPercentage: 15.0,
      termsText: 'مرحباً بك في منصة Meynaa.\nباستخدامك للمنصة فإنك توافق على الشروط والأحكام الموضحة أدناه، والتي تنظم العلاقة بينك وبين المنصة وتضمن حقوق المستوردين ومزودي الخدمات اللوجستية وفق الأنظمة المعتمدة.',
      privacyText: 'سياسة الخصوصية\nماذا نجمع؟ البيانات الأساسية: الاسم، الهاتف، البريد الإلكتروني، بيانات الموقع: GPS لمتابعة حركة الشحن.\nلماذا نستخدمها؟ لتقديم الخدمات، لتسليم الصحيح، للتواصل معك، ولتحسين المنصة.\nمع من نشاركها؟ الموظفون المعنيون، شركاء التوصيل، الجهات القانونية.',
      emailGatewayEnabled: true,
      emailGatewayAddress: 'noreply@meynaa.com',
      smsGatewayEnabled: true,
      smsGatewaySender: 'شركة الاتصالات الفلسطينية',
      webhookEnabled: true,
      webhookUrl: 'https://api.meynaa.com/webhook',
    },
    create: {
      id: 'global-config',
      commissionSea: 2.5,
      commissionAir: 3.0,
      commissionLand: 1.5,
      commissionCustom: 1.0,
      vatPercentage: 15.0,
      termsText: 'مرحباً بك في منصة Meynaa.\nباستخدامك للمنصة فإنك توافق على الشروط والأحكام الموضحة أدناه، والتي تنظم العلاقة بينك وبين المنصة وتضمن حقوق المستوردين ومزودي الخدمات اللوجستية وفق الأنظمة المعتمدة.',
      privacyText: 'سياسة الخصوصية\nماذا نجمع؟ البيانات الأساسية: الاسم، الهاتف، البريد الإلكتروني، بيانات الموقع: GPS لمتابعة حركة الشحن.\nلماذا نستخدمها؟ لتقديم الخدمات، لتسليم الصحيح، للتواصل معك، ولتحسين المنصة.\nمع من نشاركها؟ الموظفون المعنيون، شركاء التوصيل، الجهات القانونية.',
      emailGatewayEnabled: true,
      emailGatewayAddress: 'noreply@meynaa.com',
      smsGatewayEnabled: true,
      smsGatewaySender: 'شركة الاتصالات الفلسطينية',
      webhookEnabled: true,
      webhookUrl: 'https://api.meynaa.com/webhook',
    },
  });
  console.log('✓ Platform config updated');

  // 2. Users and Company Profiles
  const usersToSeed = [
    {
      email: 'nour.import@meynaa-demo.com',
      phone: '+966501112233',
      fullName: 'شركة النور للاستيراد',
      role: 'IMPORTER',
      status: 'ACTIVE',
      company: {
        companyNameAr: 'شركة النور للاستيراد',
        crNumber: '1010884920',
        vatNumber: '310294857200003',
        isVerified: true
      }
    },
    {
      email: 'gulf.logistics@meynaa-demo.com',
      phone: '+966502223344',
      fullName: 'مؤسسة الخليج اللوجستية',
      role: 'PROVIDER',
      status: 'PENDING_VERIFICATION',
      company: {
        companyNameAr: 'مؤسسة الخليج اللوجستية',
        crNumber: '1010492811',
        vatNumber: '310992817200001',
        isVerified: false
      }
    },
    {
      email: 'global.express@meynaa-demo.com',
      phone: '+966503334455',
      fullName: 'شركة العالمية السريعة',
      role: 'IMPORTER',
      status: 'BLOCKED',
      company: {
        companyNameAr: 'شركة العالمية السريعة',
        crNumber: '1010773910',
        vatNumber: '310882716200004',
        isVerified: false
      }
    },
    {
      email: 'ahmed.ali@meynaa-demo.com',
      phone: '+966504445566',
      fullName: 'أحمد محمد علي',
      role: 'IMPORTER',
      status: 'ACTIVE',
      company: {
        companyNameAr: 'مؤسسة أحمد محمد علي التجارية',
        crNumber: '1010662914',
        vatNumber: '310662914000003',
        isVerified: true
      }
    },
    {
      email: 'bahar.shipping@meynaa-demo.com',
      phone: '+966505556677',
      fullName: 'شركة البحار للشحن والتفريغ',
      role: 'PROVIDER',
      status: 'SUSPENDED',
      company: {
        companyNameAr: 'شركة البحار للشحن',
        crNumber: '1010992341',
        vatNumber: '310552431000002',
        isVerified: true
      }
    },
    {
      email: 'asateel.gulf@meynaa-demo.com',
      phone: '+966506667788',
      fullName: 'أساطيل الخليج اللوجستية',
      role: 'PROVIDER',
      status: 'ACTIVE',
      company: {
        companyNameAr: 'أساطيل الخليج اللوجستية',
        crNumber: '1010334821',
        vatNumber: '310334821000005',
        isVerified: true
      }
    },
    {
      email: 'mashreq.transport@meynaa-demo.com',
      phone: '+966507778899',
      fullName: 'شركة المشرق للنقل البري والبحري',
      role: 'PROVIDER',
      status: 'ACTIVE',
      company: {
        companyNameAr: 'شركة المشرق للنقل',
        crNumber: '1010221943',
        vatNumber: '310221943000006',
        isVerified: true
      }
    },
    {
      email: 'basaer.dist@meynaa-demo.com',
      phone: '+966508889900',
      fullName: 'شركة البصائر للتوزيع والتوريد',
      role: 'IMPORTER',
      status: 'ACTIVE',
      company: {
        companyNameAr: 'شركة البصائر للتوزيع',
        crNumber: '1010118274',
        vatNumber: '310118274000007',
        isVerified: true
      }
    }
  ];

  const createdUsers = {};
  for (const u of usersToSeed) {
    const existing = await prisma.user.findFirst({ where: { email: u.email } });
    if (!existing) {
      const user = await prisma.user.create({
        data: {
          email: u.email,
          phone: u.phone,
          fullName: u.fullName,
          passwordHash: '$2b$10$demoHashForTestingPurposesOnly123',
          role: u.role,
          status: u.status,
          companyProfile: {
            create: u.company
          }
        }
      });
      createdUsers[u.email] = user;
    } else {
      createdUsers[u.email] = existing;
    }
  }
  console.log(`✓ Seeded ${Object.keys(createdUsers).length} platform companies and users`);

  // 3. Trucks and GPS Telemetry
  const trucksToSeed = [
    { fleetCode: 'TRK-104', plateNumber: '1041 ك ب ل', truckType: 'REEFER', status: 'ON_DUTY', currentCity: 'جدة', lastSpeed: 85, lastLat: 21.5433, lastLng: 39.1728, lastTemp: -18 },
    { fleetCode: 'TRK-315', plateNumber: '3152 س ع د', truckType: 'FLATBED', status: 'INSPECTION', currentCity: 'دبي', lastSpeed: 0, lastLat: 24.1302, lastLng: 51.5891, lastTemp: 4 },
    { fleetCode: 'TRK-208', plateNumber: '2083 ر ح م', truckType: 'CONTAINER_CARRIER', status: 'REST', currentCity: 'مكة المكرمة', lastSpeed: 0, lastLat: 21.4225, lastLng: 39.8262, lastTemp: -20 },
    { fleetCode: 'TRK-519', plateNumber: '5194 د و س', truckType: 'HEAVY_TRUCK', status: 'MAINTENANCE', currentCity: 'الرياض', lastSpeed: 0, lastLat: 24.7136, lastLng: 46.6753, lastTemp: 22 },
    { fleetCode: 'TRK-220', plateNumber: '2205 ق ط ن', truckType: 'REEFER', status: 'REST', currentCity: 'الدمام', lastSpeed: 0, lastLat: 26.4207, lastLng: 50.0888, lastTemp: 5 },
    { fleetCode: 'TRK-902', plateNumber: '9026 م ن ر', truckType: 'CONTAINER_CARRIER', status: 'MAINTENANCE', currentCity: 'الرياض - جدة', lastSpeed: 0, lastLat: 24.5000, lastLng: 44.5000, lastTemp: 76 },
    { fleetCode: 'TRK-198', plateNumber: '1987 ش ه ب', truckType: 'FLATBED', status: 'ON_DUTY', currentCity: 'الجبيل', lastSpeed: 78, lastLat: 27.0046, lastLng: 49.6601, lastTemp: -15 },
    { fleetCode: 'TRK-614', plateNumber: '6148 ف ه د', truckType: 'HEAVY_TRUCK', status: 'REST', currentCity: 'الغويفات', lastSpeed: 0, lastLat: 24.1100, lastLng: 51.6000, lastTemp: 3 },
    { fleetCode: 'TRK-702', plateNumber: '7029 ش م ر', truckType: 'REEFER', status: 'ON_DUTY', currentCity: 'البطحاء', lastSpeed: 82, lastLat: 24.1500, lastLng: 51.5500, lastTemp: -22 }
  ];

  const providerUser = await prisma.user.findFirst({ where: { role: 'PROVIDER' } });
  const driverUser = await prisma.user.findFirst({ where: { role: 'DRIVER' } });

  const createdTrucks = {};
  for (const t of trucksToSeed) {
    const existing = await prisma.truck.findUnique({ where: { fleetCode: t.fleetCode } });
    if (!existing) {
      const truck = await prisma.truck.create({
        data: {
          fleetCode: t.fleetCode,
          plateNumber: t.plateNumber,
          truckType: t.truckType,
          status: t.status,
          currentCity: t.currentCity,
          lastSpeed: t.lastSpeed,
          lastLatitude: t.lastLat,
          lastLongitude: t.lastLng,
          lastTemperature: t.lastTemp,
          providerId: providerUser ? providerUser.id : undefined,
          driverId: driverUser ? driverUser.id : undefined
        }
      });
      createdTrucks[t.fleetCode] = truck;
    } else {
      createdTrucks[t.fleetCode] = existing;
    }
  }
  console.log(`✓ Seeded ${Object.keys(createdTrucks).length} fleet trucks`);

  // 4. Fleet Alerts
  const alertsToSeed = [
    {
      truckCode: 'TRK-902',
      alertType: 'ROUTE_DEVIATION',
      severity: 'HIGH',
      title: 'تنبيه خروج عن المسار المخصص',
      description: 'انحرفت الشاحنة عن المسار المعتمد على طريق الرياض - الطائف بمقدار 14 كم دون إشعار مسبق من السائق.',
      isResolved: false
    },
    {
      truckCode: 'TRK-104',
      alertType: 'TEMPERATURE_HIGH',
      severity: 'CRITICAL',
      title: 'ارتفاع حرارة الشاحنة',
      description: 'درجة الحرارة 76°C (تجاوز الحد المسموح للشحنات المبردة الحساسة).',
      isResolved: false
    },
    {
      truckCode: 'TRK-519',
      alertType: 'BREAKDOWN',
      severity: 'HIGH',
      title: 'عطل ميكانيكي مفاجئ',
      description: 'عطل ميكانيكي مفاجئ في المحرك - توقف كامل على طريق وادي الدواسر.',
      isResolved: false
    }
  ];

  for (const a of alertsToSeed) {
    const truck = createdTrucks[a.truckCode];
    if (truck) {
      await prisma.fleetAlert.create({
        data: {
          truckId: truck.id,
          alertType: a.alertType,
          severity: a.severity,
          title: a.title,
          description: a.description,
          isResolved: a.isResolved
        }
      });
    }
  }
  console.log('✓ Seeded fleet emergency alerts');

  // 5. Real Shipments
  const importerUser = await prisma.user.findFirst({ where: { role: 'IMPORTER' } });
  const shipmentsToSeed = [
    { trackingNumber: 'SHN-2026-884', sector: 'SEA_FREIGHT', originName: 'ميناء هامبورغ (ألمانيا)', destName: 'ميناء جدة الإسلامي', status: 'DELIVERED', cargoWeight: 24.5, value: 87500 },
    { trackingNumber: 'SHN-2026-756', sector: 'LAND_TRANSPORT', originName: 'مستودعات جدة المركزية', destName: 'الميناء الجاف بالدمام', status: 'IN_TRANSIT', cargoWeight: 18.0, value: 51200 },
    { trackingNumber: 'SHN-2026-901', sector: 'AIR_FREIGHT', originName: 'مطار شنغهاي الدولي (الصين)', destName: 'مطار أبوظبي الدولي', status: 'CUSTOMS_HOLD', cargoWeight: 4.2, value: 22400 },
    { trackingNumber: 'SHN-2026-867', sector: 'SEA_FREIGHT', originName: 'ميناء جنوة (إيطاليا)', destName: 'ميناء الملك عبد العزيز (الدمام)', status: 'IN_TRANSIT', cargoWeight: 32.0, value: 38000 },
    { trackingNumber: 'SHN-2026-903', sector: 'LAND_TRANSPORT', originName: 'المدينة الصناعية الثانية (الرياض)', destName: 'المنطقة الحرة جبل علي (دبي)', status: 'DELIVERED', cargoWeight: 15.5, value: 45000 },
    { trackingNumber: 'SHN-2026-912', sector: 'AIR_FREIGHT', originName: 'مطار دبي الدولي (الإمارات)', destName: 'مطار الملك خالد الدولي (الرياض)', status: 'IN_TRANSIT', cargoWeight: 2.8, value: 28500 },
    { trackingNumber: 'SHN-2026-966', sector: 'SEA_FREIGHT', originName: 'ميناء خليفة (أبو ظبي)', destName: 'ميناء جدة الإسلامي', status: 'READY_FOR_PICKUP', cargoWeight: 40.0, value: 65000 },
    { trackingNumber: 'SHN-2026-812', sector: 'LAND_TRANSPORT', originName: 'مدينة الملك عبد الله الاقتصادية', destName: 'مستودعات دبي اللوجستية', status: 'DELIVERED', cargoWeight: 12.0, value: 27500 },
    { trackingNumber: 'SHN-2026-905', sector: 'CUSTOMS_CLEARANCE', originName: 'منفذ البطحاء الحدودي', destName: 'منطقة الرياض الجمركية', status: 'CUSTOMS_HOLD', cargoWeight: 20.0, value: 34000 }
  ];

  for (const s of shipmentsToSeed) {
    const existing = await prisma.shipment.findUnique({ where: { trackingNumber: s.trackingNumber } });
    if (!existing && importerUser && providerUser) {
      await prisma.shipment.create({
        data: {
          trackingNumber: s.trackingNumber,
          sector: s.sector,
          originName: s.originName,
          destName: s.destName,
          status: s.status,
          cargoWeight: s.cargoWeight,
          importerId: importerUser.id,
          providerId: providerUser.id
        }
      });
    }
  }
  console.log('✓ Seeded platform shipments');

  // 6. Invoices
  const invoicesToSeed = [
    { invoiceNumber: 'INV-2026-123', subtotalAmount: 14200, vatAmount: 2130, commissionAmount: 355, totalAmount: 16330, paymentStatus: 'PAID' },
    { invoiceNumber: 'INV-2026-124', subtotalAmount: 24500, vatAmount: 3675, commissionAmount: 612.5, totalAmount: 28175, paymentStatus: 'PAID' },
    { invoiceNumber: 'INV-2025-125', subtotalAmount: 18000, vatAmount: 2700, commissionAmount: 450, totalAmount: 20700, paymentStatus: 'UNPAID' },
    { invoiceNumber: 'INV-2026-126', subtotalAmount: 32000, vatAmount: 4800, commissionAmount: 800, totalAmount: 36800, paymentStatus: 'PAID' },
    { invoiceNumber: 'INV-2026-127', subtotalAmount: 12500, vatAmount: 1875, commissionAmount: 312.5, totalAmount: 14375, paymentStatus: 'PAID' }
  ];

  const createdInvoices = [];

  for (let i = 0; i < invoicesToSeed.length; i++) {
    const inv = invoicesToSeed[i];

    let existing = await prisma.invoice.findUnique({ where: { invoiceNumber: inv.invoiceNumber } });
    if (!existing) {
      let sh = await prisma.shipment.findFirst({
        where: { invoice: null }
      });
      if (!sh && importerUser && providerUser) {
        sh = await prisma.shipment.create({
          data: {
            trackingNumber: `SHN-2026-INV-${i + 1}`,
            sector: i % 2 === 0 ? 'LAND_TRANSPORT' : 'SEA_FREIGHT',
            originName: 'الرياض',
            destName: 'جدة',
            status: 'DELIVERED',
            cargoWeight: 15.0,
            importerId: importerUser.id,
            providerId: providerUser.id
          }
        });
      }
      if (sh) {
        existing = await prisma.invoice.create({
          data: {
            invoiceNumber: inv.invoiceNumber,
            shipmentId: sh.id,
            subtotal: inv.subtotalAmount,
            taxAmount: inv.vatAmount,
            commissionRate: 0.025,
            commissionAmount: inv.commissionAmount,
            providerPayoutNet: inv.subtotalAmount - inv.commissionAmount,
            totalAmount: inv.totalAmount,
            currency: 'USD',
            paymentStatus: inv.paymentStatus
          }
        });
      }
    }
    if (existing) {
      createdInvoices.push(existing);
    }
  }
  console.log(`✓ Seeded ${createdInvoices.length} invoices`);

  // 7. Bank Transfer Notifications
  const bankTransfersToSeed = [
    {
      transferAmount: 13800,
      subtotalAmount: 13800,
      commissionAmount: 0.0,
      commissionRate: 0.0,
      currency: 'USD',
      transferRefNumber: 'TXN-984210',
      senderBankName: 'مصرف الإنماء',
      senderAccountName: 'سارة المستوردة / شركة النور',
      recipientName: 'شركة الفرسان للنقل البري والبحري',
      recipientBankName: 'مصرف الراجحي',
      recipientIban: 'SA4480000123456789012345',
      status: 'SUBMITTED_TO_ADMIN',
      isTrialPeriod: true
    },
    {
      transferAmount: 2050,
      subtotalAmount: 2000,
      commissionAmount: 50,
      commissionRate: 0.025,
      currency: 'DINAR',
      transferRefNumber: 'TXN-773419',
      senderBankName: 'بنك الاتحاد',
      senderAccountName: 'أحمد محمد علي',
      recipientName: 'مؤسسة الخليج للنقل البري',
      recipientBankName: 'البنك الأهلي السعودي',
      recipientIban: 'SA2210000987654321098765',
      status: 'APPROVED_BY_ADMIN',
      isTrialPeriod: false
    },
    {
      transferAmount: 5125,
      subtotalAmount: 5000,
      commissionAmount: 125,
      commissionRate: 0.025,
      currency: 'EUR',
      transferRefNumber: 'TXN-334102',
      senderBankName: 'Deutsche Bank',
      senderAccountName: 'العالمية السريعة للتجارة',
      recipientName: 'شركة أوتو كارير الدولية',
      recipientBankName: 'بنك الرياض',
      recipientIban: 'SA9920000456123789045612',
      status: 'CONFIRMED_BY_PROVIDER',
      isTrialPeriod: false
    }
  ];

  for (let i = 0; i < bankTransfersToSeed.length; i++) {
    const bt = bankTransfersToSeed[i];
    const existing = await prisma.bankTransferTransaction.findFirst({ where: { transferRefNumber: bt.transferRefNumber } });
    if (!existing && importerUser) {
      const inv = createdInvoices[i] || (await prisma.invoice.findFirst());
      if (inv) {
        await prisma.bankTransferTransaction.create({
          data: {
            transferAmount: bt.transferAmount,
            subtotalAmount: bt.subtotalAmount,
            commissionAmount: bt.commissionAmount,
            commissionRate: bt.commissionRate,
            currency: bt.currency,
            transferRefNumber: bt.transferRefNumber,
            senderBankName: bt.senderBankName,
            senderAccountName: bt.senderAccountName,
            recipientName: bt.recipientName,
            recipientBankName: bt.recipientBankName,
            recipientIban: bt.recipientIban,
            status: bt.status,
            isTrialPeriod: bt.isTrialPeriod,
            payerId: importerUser.id,
            recipientProviderId: providerUser ? providerUser.id : undefined,
            invoiceId: inv.id,
            transferDate: new Date(),
            receiptFileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
          }
        });
      }
    }
  }
  console.log('✓ Seeded bank transfer transactions');

  // 8. Support Tickets & Inbox
  const supportTicketsToSeed = [
    { ticketNum: '#1001', subject: 'مشكلة في الدفع', priority: 'CRITICAL', status: 'NEW', clientName: 'شركة النور للاستيراد', agentName: 'سارة علي', content: 'واجهنا خطأ أثناء إتمام عملية الدفع عبر بطاقة الائتمان للطلب رقم ORD-884.', type: 'ticket' },
    { ticketNum: '#1002', subject: 'استفسار عن عمولة', priority: 'MEDIUM', status: 'RESOLVED', clientName: 'مؤسسة الخليج اللوجستية', agentName: 'محمد أحمد', content: 'استفسار حول آلية احتساب نسبة العمولة لعمليات النقل البري الترانزيت.', type: 'ticket' },
    { ticketNum: '#1003', subject: 'طلب سحب أرباح', priority: 'NORMAL', status: 'IN_PROGRESS', clientName: 'شركة المشرق للنقل', agentName: 'دينا محمود', content: 'طلب تحويل رصيد الأرباح المتراكم لحسابنا البنكي المعتمد.', type: 'ticket' },
    { ticketNum: '#1004', subject: 'مشكلة في الشحنات', priority: 'MEDIUM', status: 'WAITING_CLIENT', clientName: 'أساطيل الخليج اللوجستية', agentName: 'عمر خالد', content: 'تأخر التفتيش الجمركي في منفذ البطحاء للشاحنة رقم TRK-315.', type: 'ticket' },
    { ticketNum: '#1005', subject: 'استفسار عن الفواتير', priority: 'NORMAL', status: 'NEW', clientName: 'العالمية السريعة للشحن', agentName: 'عمر حسن', content: 'نحتاج نسخة موقعة من الفاتورة الضريبية لشهر يوليو 2026.', type: 'ticket' },
    // Inbox Messages
    { ticketNum: '#MSG-1', subject: 'استفسار رسوم الشحن', priority: 'CRITICAL', status: 'NEW', clientName: 'حسن أحمد', agentName: 'فريق الدعم الفوري', content: 'أريد الاستفسار عن رسوم الشحن للبضائع الغذائية المجمدة بين جدة والرياض.', type: 'chat' },
    { ticketNum: '#MSG-2', subject: 'تتبع شاحنة ميداني', priority: 'MEDIUM', status: 'READ', clientName: 'شركة المقاولات المتحدة', agentName: 'مركز المتابعة', content: 'هل يمكن تتبع الشاحنة رقم TRK-104 على الخريطة مباشرة الآن؟', type: 'call' },
    { ticketNum: '#MSG-3', subject: 'شكر وتقدير', priority: 'NORMAL', status: 'RESOLVED', clientName: 'خالد وليد', agentName: 'سارة علي', content: 'شكراً جزيلاً لفريق الدعم على حل مشكلة تصريح الشحن بسرعة فائقة.', type: 'chat' },
    { ticketNum: '#MSG-4', subject: 'موعد تسليم الشحنة', priority: 'IN_PROGRESS', status: 'WAITING_CLIENT', clientName: 'سارة محمود', agentName: 'دينا محمود', content: 'متى سيتم تسليم شحنة الأثاث المكتبي في مستودع الدمام؟', type: 'call' },
    { ticketNum: '#MSG-5', subject: 'إغلاق تذكرة', priority: 'NORMAL', status: 'RESOLVED', clientName: 'شركة النقل السريع', agentName: 'محمد أحمد', content: 'تم حل المشكلة وتفريغ الحاوية بسلام، شكراً لتعاونكم.', type: 'chat' }
  ];

  for (const st of supportTicketsToSeed) {
    await prisma.supportTicket.upsert({
      where: { ticketNum: st.ticketNum },
      update: {
        subject: st.subject,
        priority: st.priority,
        status: st.status,
        clientName: st.clientName,
        agentName: st.agentName,
        content: st.content,
        type: st.type
      },
      create: {
        ticketNum: st.ticketNum,
        subject: st.subject,
        priority: st.priority,
        status: st.status,
        clientName: st.clientName,
        agentName: st.agentName,
        content: st.content,
        type: st.type
      }
    });
  }
  console.log('✓ Seeded support tickets and unified inbox');

  // 9. Activity Logs
  const activityLogsToSeed = [
    { action: 'CREATE_SHIPMENT', details: 'طلب شحنة جديدة من العميل أحمد محمد' },
    { action: 'VERIFY_PROVIDER', details: 'تم اعتماد شركة النقل البحري' },
    { action: 'UPDATE_STATUS', details: 'تم تحديث حالة الشحنة SHN-2026-884 إلى مكتملة' },
    { action: 'NEW_MESSAGE', details: 'رسالة جديدة من أحد المستخدمين عبر مركز الدعم' },
    { action: 'APPROVE_BANK_TRANSFER', details: 'تم إتمام وتدقيق عملية دفع بنجاح لحساب مزود الخدمة' }
  ];

  for (const al of activityLogsToSeed) {
    await prisma.activityLog.create({
      data: {
        action: al.action,
        details: al.details
      }
    });
  }
  console.log('✓ Seeded real-time activity logs');

  console.log('--- Database seeding completed successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
