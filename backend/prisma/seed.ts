import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();

  const saltRounds = 10;

  await prisma.admin.create({
    data: {
      name: "Administrador",
      email: "admin@gerenciamento.com",
      password: await bcrypt.hash("Admin@2026", saltRounds),
    },
  });

  const users = [
    {
      fullName: "Ana Maria Silva",
      email: "ana.silva@email.com",
      password: await bcrypt.hash("Senha@123", saltRounds),
      phone: "(11) 99876-5432",
      birthDate: "1990-03-15",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 101",
      neighborhood: "Jardim Primavera",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      status: "ACTIVE",
    },
    {
      fullName: "Carlos Eduardo Souza",
      email: "carlos.souza@email.com",
      password: await bcrypt.hash("Senha@456", saltRounds),
      phone: "(21) 98765-4321",
      birthDate: "1985-07-22",
      street: "Av. Brasil",
      number: "456",
      complement: "",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22041-080",
      status: "ACTIVE",
    },
    {
      fullName: "Mariana Oliveira Costa",
      email: "mariana.costa@email.com",
      password: await bcrypt.hash("Senha@789", saltRounds),
      phone: "(31) 97654-3210",
      birthDate: "1992-11-08",
      street: "Rua da Paz",
      number: "789",
      complement: "Casa",
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30130-000",
      status: "ACTIVE",
    },
    {
      fullName: "Pedro Henrique Almeida",
      email: "pedro.almeida@email.com",
      password: await bcrypt.hash("Senha@321", saltRounds),
      phone: "(41) 96543-2109",
      birthDate: "1988-01-30",
      street: "Rua XV de Novembro",
      number: "321",
      complement: "Sala 202",
      neighborhood: "Centro",
      city: "Curitiba",
      state: "PR",
      zipCode: "80020-310",
      status: "INACTIVE",
    },
    {
      fullName: "Juliana Ferreira Lima",
      email: "juliana.lima@email.com",
      password: await bcrypt.hash("Senha@654", saltRounds),
      phone: "(51) 95432-1098",
      birthDate: "1995-05-17",
      street: "Av. Ipiranga",
      number: "654",
      complement: "",
      neighborhood: "Cidade Baixa",
      city: "Porto Alegre",
      state: "RS",
      zipCode: "90150-060",
      status: "ACTIVE",
    },
    {
      fullName: "Lucas Gabriel Pereira",
      email: "lucas.pereira@email.com",
      password: await bcrypt.hash("Senha@987", saltRounds),
      phone: "(71) 94321-0987",
      birthDate: "1993-09-03",
      street: "Rua Chile",
      number: "987",
      complement: "Apto 303",
      neighborhood: "Pelourinho",
      city: "Salvador",
      state: "BA",
      zipCode: "40015-170",
      status: "ACTIVE",
    },
    {
      fullName: "Fernanda Santos Rodrigues",
      email: "fernanda.rodrigues@email.com",
      password: await bcrypt.hash("Senha@147", saltRounds),
      phone: "(85) 93210-9876",
      birthDate: "1991-12-25",
      street: "Av. Beira Mar",
      number: "147",
      complement: "Cobertura",
      neighborhood: "Meireles",
      city: "Fortaleza",
      state: "CE",
      zipCode: "60165-120",
      status: "INACTIVE",
    },
    {
      fullName: "Rafael Mendes Barros",
      email: "rafael.barros@email.com",
      password: await bcrypt.hash("Senha@258", saltRounds),
      phone: "(62) 92109-8765",
      birthDate: "1987-04-11",
      street: "Rua T-63",
      number: "258",
      complement: "",
      neighborhood: "Bueno",
      city: "Goiânia",
      state: "GO",
      zipCode: "74215-020",
      status: "ACTIVE",
    },
    {
      fullName: "Camila Rodrigues Nascimento",
      email: "camila.nascimento@email.com",
      password: await bcrypt.hash("Senha@369", saltRounds),
      phone: "(81) 91098-7654",
      birthDate: "1994-08-19",
      street: "Rua da Aurora",
      number: "369",
      complement: "Apto 404",
      neighborhood: "Boa Vista",
      city: "Recife",
      state: "PE",
      zipCode: "50050-190",
      status: "ACTIVE",
    },
    {
      fullName: "Thiago Araújo Martins",
      email: "thiago.martins@email.com",
      password: await bcrypt.hash("Senha@741", saltRounds),
      phone: "(61) 90987-6543",
      birthDate: "1996-02-14",
      street: "SGAN 604",
      number: "741",
      complement: "Bloco B",
      neighborhood: "Asa Norte",
      city: "Brasília",
      state: "DF",
      zipCode: "70840-020",
      status: "INACTIVE",
    },
    {
      fullName: "Patrícia Duarte Fonseca",
      email: "patricia.fonseca@email.com",
      password: await bcrypt.hash("Senha@852", saltRounds),
      phone: "(48) 99876-1234",
      birthDate: "1989-06-07",
      street: "Rua Esteves Júnior",
      number: "852",
      complement: "Loja 1",
      neighborhood: "Centro",
      city: "Florianópolis",
      state: "SC",
      zipCode: "88015-110",
      status: "ACTIVE",
    },
    {
      fullName: "Roberto Nunes Teixeira",
      email: "roberto.teixeira@email.com",
      password: await bcrypt.hash("Senha@963", saltRounds),
      phone: "(91) 98765-0012",
      birthDate: "1983-10-21",
      street: "Av. Nazaré",
      number: "963",
      complement: "",
      neighborhood: "Nazaré",
      city: "Belém",
      state: "PA",
      zipCode: "66035-100",
      status: "ACTIVE",
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  const activities = [
    {
      title: "Reunião Geral de Equipe",
      description: "Alinhamento semanal de metas e métricas",
      date: `${year}-${month}-04`,
      startTime: "09:00",
      endTime: "10:00",
      status: "COMPLETED",
      priority: "HIGH",
    },
    {
      title: "Entrevista Candidato Tech Lead",
      description: "Avaliação técnica para nova vaga de liderança",
      date: `${year}-${month}-12`,
      startTime: "14:00",
      endTime: "15:00",
      status: "PENDING",
      priority: "HIGH",
    },
    {
      title: "Auditoria de Segurança e Acessos",
      description: "Revisão periódica de permissões de usuários",
      date: `${year}-${month}-18`,
      startTime: "11:00",
      endTime: "12:00",
      status: "PENDING",
      priority: "MEDIUM",
    },
    {
      title: "Treinamento Interno de React 19",
      description: "Workshop prático sobre hooks e performance",
      date: `${year}-${month}-22`,
      startTime: "16:00",
      endTime: "17:30",
      status: "PENDING",
      priority: "LOW",
    },
    {
      title: "Deploy e Validação de Versão",
      description: "Publicação da nova release do sistema",
      date: `${year}-${month}-27`,
      startTime: "20:00",
      endTime: "21:00",
      status: "PENDING",
      priority: "HIGH",
    },
  ];

  for (const activity of activities) {
    await prisma.activity.create({ data: activity });
  }

  console.log("Seed executado com sucesso! 12 usuários, 1 administrador e 5 atividades criados.");
  console.log("Acesso ao painel: admin@gerenciamento.com / Admin@2026");
}

main()
  .catch((e) => {
    console.error("Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
