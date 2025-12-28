import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Police Stations
  console.log('Creating police stations...');
  const station1 = await prisma.policeStation.create({
    data: {
      name: 'Central Police Station',
      district: 'Central',
      state: 'Karnataka',
    },
  });

  const station2 = await prisma.policeStation.create({
    data: {
      name: 'North Police Station',
      district: 'North',
      state: 'Karnataka',
    },
  });

  // Create Courts
  console.log('Creating courts...');
  const court1 = await prisma.court.create({
    data: {
      name: 'District Court - Central',
      courtType: 'MAGISTRATE',
      district: 'Central',
      state: 'Karnataka',
    },
  });

  const court2 = await prisma.court.create({
    data: {
      name: 'High Court - State',
      courtType: 'HIGH_COURT',
      district: 'State',
      state: 'Karnataka',
    },
  });

  // Create Users
  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // SHO for Central Station
  const sho1 = await prisma.user.create({
    data: {
      email: 'sho.central@police.gov',
      name: 'Rajesh Kumar (SHO)',
      phone: '9876543210',
      role: 'SHO',
      organizationType: 'POLICE_STATION',
      organizationId: station1.id,
      isActive: true,
    },
  });

  // Police Officers for Central Station
  const police1 = await prisma.user.create({
    data: {
      email: 'officer1@police.gov',
      name: 'Priya Sharma (Police Officer)',
      phone: '9876543211',
      role: 'POLICE',
      organizationType: 'POLICE_STATION',
      organizationId: station1.id,
      isActive: true,
    },
  });

  const police2 = await prisma.user.create({
    data: {
      email: 'officer2@police.gov',
      name: 'Amit Patel (Police Officer)',
      phone: '9876543212',
      role: 'POLICE',
      organizationType: 'POLICE_STATION',
      organizationId: station1.id,
      isActive: true,
    },
  });

  // SHO for North Station
  const sho2 = await prisma.user.create({
    data: {
      email: 'sho.north@police.gov',
      name: 'Suresh Reddy (SHO)',
      phone: '9876543213',
      role: 'SHO',
      organizationType: 'POLICE_STATION',
      organizationId: station2.id,
      isActive: true,
    },
  });

  // Court Clerk
  const clerk = await prisma.user.create({
    data: {
      email: 'clerk@court.gov',
      name: 'Anita Desai (Court Clerk)',
      phone: '9876543214',
      role: 'COURT_CLERK',
      organizationType: 'COURT',
      organizationId: court1.id,
      isActive: true,
    },
  });

  // Judge
  const judge = await prisma.user.create({
    data: {
      email: 'judge@court.gov',
      name: 'Justice M. S. Singh',
      phone: '9876543215',
      role: 'JUDGE',
      organizationType: 'COURT',
      organizationId: court1.id,
      isActive: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('-------------------');
  console.log('SHO (Central):');
  console.log('  Email: sho.central@police.gov');
  console.log('  Password: password123');
  console.log('\nPolice Officer 1:');
  console.log('  Email: officer1@police.gov');
  console.log('  Password: password123');
  console.log('\nPolice Officer 2:');
  console.log('  Email: officer2@police.gov');
  console.log('  Password: password123');
  console.log('\nSHO (North):');
  console.log('  Email: sho.north@police.gov');
  console.log('  Password: password123');
  console.log('\nCourt Clerk:');
  console.log('  Email: clerk@court.gov');
  console.log('  Password: password123');
  console.log('\nJudge:');
  console.log('  Email: judge@court.gov');
  console.log('  Password: password123');
  console.log('\n🏢 Organizations:');
  console.log('-------------------');
  console.log(`Police Station 1: ${station1.name}`);
  console.log(`Police Station 2: ${station2.name}`);
  console.log(`Court 1: ${court1.name}`);
  console.log(`Court 2: ${court2.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
