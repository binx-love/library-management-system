import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const genres = ["Fiction", "Science Fiction", "History", "Self-Development"];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const genreRows = await prisma.genre.findMany();
  const getGenreId = (name: string): number => {
    const genre = genreRows.find((row) => row.name === name);
    if (!genre) throw new Error(`Genre not found: ${name}`);
    return genre.id;
  };

  const books = [
    ["Things Fall Apart", "Chinua Achebe", "9780385474542", "Fiction"],
    ["The Kite Runner", "Khaled Hosseini", "9781594631931", "Fiction"],
    ["Pride and Prejudice", "Jane Austen", "9780141439518", "Fiction"],
    ["The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", "Fiction"],
    ["Americanah", "Chimamanda Ngozi Adichie", "9780307455925", "Fiction"],
    ["Dune", "Frank Herbert", "9780441172719", "Science Fiction"],
    ["1984", "George Orwell", "9780451524935", "Science Fiction"],
    ["The Martian", "Andy Weir", "9780553418026", "Science Fiction"],
    ["Fahrenheit 451", "Ray Bradbury", "9781451673319", "Science Fiction"],
    ["A Brief History of Time", "Stephen Hawking", "9780553380163", "History"],
    ["The Diary of a Young Girl", "Anne Frank", "9780553296983", "History"],
    ["Long Walk to Freedom", "Nelson Mandela", "9780316548182", "History"],
    ["Atomic Habits", "James Clear", "9780735211292", "Self-Development"],
    ["The 7 Habits of Highly Effective People", "Stephen R. Covey", "9781982137274", "Self-Development"],
    ["Mindset", "Carol S. Dweck", "9780345472328", "Self-Development"],
  ] as const;

  for (const [title, author, isbn, genreName] of books) {
    await prisma.book.upsert({
      where: { isbn },
      update: { title, author, genreId: getGenreId(genreName) },
      create: { title, author, isbn, genreId: getGenreId(genreName) },
    });
  }

  console.log("Seed complete: 4 genres and 15 books are available.");
}

main()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
