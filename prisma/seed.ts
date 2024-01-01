// const PrismaClient = require('@prisma/client').PrismaClient;

// const prisma = new PrismaClient();

// async function createPreventiveWithAssignment() {
//     try {
//         const business = await prisma.business.create({
//             data: {
//                 name: 'Business 1',
//             },
//         });

//         const province = await prisma.province.create({
//             data: {
//                 name: 'Province 1',
//             },
//         });

//         const city = await prisma.city.create({
//             data: {
//                 name: 'City 1',
//                 province: {
//                     connect: {
//                         id: province.id,
//                     },
//                 },
//             },
//         });

//         const user = await prisma.user.create({
//             data: {
//                 email: 'example@gmail.com',
//                 password: '123456',
//                 firstName: 'John',
//                 fullName: 'John Doe',
//                 lastName: 'Doe',
//             },
//         });

//         const client = await prisma.client.create({
//             data: {
//                 name: 'Client 1',
//             },
//         });

//         const branch = await prisma.branch.create({
//             data: {
//                 number: 1,
//                 client: {
//                     connect: {
//                         id: client.id,
//                     },
//                 },
//                 city: {
//                     connect: {
//                         id: city.id,
//                     },
//                 },
//             },
//         });

//         const preventive = await prisma.preventive.create({
//             data: {
//                 assigned: {
//                     connect: [
//                         {
//                             id: user.id,
//                         },
//                     ],
//                 },
//                 business: {
//                     connect: {
//                         id: business.id,
//                     },
//                 },
//                 branch: {
//                     connect: {
//                         id: branch.id,
//                     },
//                 },
//                 status: 'Pendiente',
//                 frequency: 4,
//                 months: ['Agosto'],
//                 observations: 'etc',
//             },
//         });

//         console.log('Preventive created successfully');
//         console.log(preventive);

//         console.log('Preventive with assignment created successfully');
//     } catch (error) {
//         console.error('Error creating preventive with assignment:', error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// createPreventiveWithAssignment();
