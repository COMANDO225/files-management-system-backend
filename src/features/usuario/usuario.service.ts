import prisma from "@/lib/prisma";
// si prisma.ts exporta prisma client
export async function getUsuarios() {
	return prisma.user.findMany({
		include: {
			perfil: true,
		},
	});
}
