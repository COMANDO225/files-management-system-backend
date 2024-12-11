import { hashString } from "../src/lib/bcrypt";
import prisma from "../src/lib/prisma";

async function createSuperAdmin() {
	const email = "admin@gmail.com";
	const plainPassword = "admin";

	const existingSuperAdmin = await prisma.user.findFirst({
		where: { role: "superadmin" },
	});

	if (existingSuperAdmin) {
		console.log("Eliminando el super administrador existente...");
		await prisma.user.delete({
			where: { id: existingSuperAdmin.id },
		});
		console.log("Super administrador eliminado.");
	}

	const hashedPassword = await hashString(plainPassword);

	const superAdmin = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			role: "superadmin",
			estado: true,
			perfil: {
				create: {
					firstName: "Anderson",
					lastName: "Almeyda God",
				},
			},
		},
	});

	console.log("Super administrador creado con éxito:", superAdmin);
}

createSuperAdmin()
	.catch((err) => {
		console.error("Error al crear el super administrador masna:", err);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
