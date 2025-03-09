const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const dataCount = 1000000;

async function seedDatabase() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    const fakeData = [];

    for (let i = 0; i < dataCount; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const age = faker.number.int({ min: 18, max: 85 });

      const person = {
        name: `${firstName} ${lastName}`,
        age,
        occupation: faker.helpers.arrayElement([
          'engineer',
          'doctor',
          'writer',
          'artist',
          'teacher',
          'developer',
        ]),
        salary: faker.finance.amount({
          min: 30000 + age * 1000,
          max: 150000 + age * 1000,
          dec: 0,
        }),
        personality: {
          traits: Array.from({ length: 3 }, () => faker.word.adjective()),
          mbti: faker.helpers.arrayElement([
            'INTJ',
            'INTP',
            'ENTJ',
            'ENTP',
            'INFJ',
            'INFP',
            'ENFJ',
            'ENFP',
            'ISTJ',
            'ISFJ',
            'ESTJ',
            'ESFJ',
            'ISTP',
            'ISFP',
            'ESTP',
            'ESFP',
          ]),
          favoriteColor: faker.color.human(),
        },
        createdAt: faker.date.recent({ days: 30 }),
      };

      fakeData.push(person);

      if ((i + 1) % 1000 === 0) {
        console.log(`Generated ${i + 1} records`);
      }
    }

    await db.collection('people').insertMany(fakeData);
    console.log('Data insertion complete');

    await client.close();
  } catch (e) {
    console.error(e);
  }
}

seedDatabase();
