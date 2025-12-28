import { prisma } from '../../prisma/client';

export class OrganizationService {
  /**
   * Get all police stations
   */
  async getAllPoliceStations() {
    const policeStations = await prisma.policeStation.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        jurisdiction: true,
        address: true,
        contactPhone: true,
        contactEmail: true,
        sho: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return policeStations;
  }

  /**
   * Get all courts
   */
  async getAllCourts() {
    const courts = await prisma.court.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        courtType: true,
        jurisdiction: true,
        address: true,
        contactPhone: true,
        contactEmail: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return courts;
  }
}
