import "dotenv/config";
import { prisma } from "../src/prismaClient.js";
import bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database...');
  
  // 1. Clean Database safely (optional, but requested implicitly to populate robustly)
  await prisma.booking.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.route.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (Operator and Commuter)
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const operator = await prisma.user.create({
    data: {
      name: 'Admin Operator',
      email: 'admin@smartbus.com',
      passwordHash,
      role: 'OPERATOR',
    }
  });

  const commuter = await prisma.user.create({
    data: {
      name: 'Test Passenger',
      email: 'user@smartbus.com',
      passwordHash,
      role: 'COMMUTER',
    }
  });

  // 3. Create Routes
  const route1 = await prisma.route.create({
    data: { origin: 'Ahmedabad', destination: 'Surat', distanceKm: 265, routeName: 'AMD-SRT Express' }
  });
  const route2 = await prisma.route.create({
    data: { origin: 'Mumbai', destination: 'Pune', distanceKm: 150, routeName: 'MUM-PUN Local' }
  });
  const route3 = await prisma.route.create({
    data: { origin: 'Delhi', destination: 'Jaipur', distanceKm: 280, routeName: 'DEL-JPR Sleeper' }
  });

  // 4. Create Buses
  const bus1 = await prisma.bus.create({
    data: { operatorId: operator.id, registrationNo: 'GJ-01-AB-1234', totalSeats: 40, busType: 'AC' }
  });
  const bus2 = await prisma.bus.create({
    data: { operatorId: operator.id, registrationNo: 'GJ-05-CD-5678', totalSeats: 30, busType: 'AC' }
  });
  const bus3 = await prisma.bus.create({
    data: { operatorId: operator.id, registrationNo: 'MH-02-XY-9012', totalSeats: 50, busType: 'NON_AC' }
  });

  const today = new Date();
  
  const tripPromises = [];
  for (let i = 0; i < 14; i++) {
    // Over the next 14 days, generate trips
    const tripDate1 = new Date(today.getTime() + 24 * 60 * 60 * 1000 * i);
    tripDate1.setHours(9, 0, 0, 0);
    const arrDate1 = new Date(tripDate1.getTime() + 4.5 * 60 * 60 * 1000); // 4.5h trip
    
    tripPromises.push(prisma.trip.create({
      data: { busId: bus1.id, routeId: route1.id, departureTime: tripDate1, arrivalTime: arrDate1, fare: 550.00 }
    }));

    const tripDate2 = new Date(today.getTime() + 24 * 60 * 60 * 1000 * i);
    tripDate2.setHours(14, 0, 0, 0);
    const arrDate2 = new Date(tripDate2.getTime() + 6 * 60 * 60 * 1000); // 6h trip

    tripPromises.push(prisma.trip.create({
      data: { busId: bus2.id, routeId: route2.id, departureTime: tripDate2, arrivalTime: arrDate2, fare: 800.00 }
    }));

    const tripDate3 = new Date(today.getTime() + 24 * 60 * 60 * 1000 * i);
    tripDate3.setHours(21, 30, 0, 0);
    const arrDate3 = new Date(tripDate3.getTime() + 8 * 60 * 60 * 1000); // 8h sleeper trip

    tripPromises.push(prisma.trip.create({
      data: { busId: bus3.id, routeId: route3.id, departureTime: tripDate3, arrivalTime: arrDate3, fare: 1200.00 }
    }));
  }

  await Promise.all(tripPromises);

  console.log('Seeding complete! You can login with: admin@smartbus.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
