import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as bodyParser from 'body-parser';

describe('Justifier API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(bodyParser.text({ type: 'text/plain', limit: '5mb' }));
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it('Happy path: get token and justify text', async () => {
    const email = 'tictactrip@example.com';
    const tokenRes = await request(app.getHttpServer())
      .post('/token')
      .send({ email })
      .expect(201);
    const token = tokenRes.body.token;
    expect(token).toBeDefined();
    const text =
      'This is a simple test that says that TicTacTrip is the best startup ever!';
    const justifyRes = await request(app.getHttpServer())
      .post('/justify')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'text/plain')
      .send(text)
      .expect(201);
    expect(typeof justifyRes.text).toBe('string');
    const lines = justifyRes.text.split('\n');
    lines.slice(0, -1).forEach((line) => {
      expect(line.length).toBeLessThanOrEqual(80);
    });
  });
  it('Should return error 402', async () => {
    const email = 'tictactrip@example.com';
    const tokenRes = await request(app.getHttpServer())
      .post('/token')
      .send({ email });
    const token = tokenRes.body.token;
    const bigText = 'tictactrip '.repeat(80000);
    await request(app.getHttpServer())
      .post('/justify')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'text/plain')
      .send(bigText)
      .expect(201);
    await request(app.getHttpServer())
      .post('/justify')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'text/plain')
      .send('one more word')
      .expect(402);
  });
  it('should indicate that authorization is missing', async () => {
    await request(app.getHttpServer())
      .post('/justify')
      .set('Authorization', `Bearer tictactrip`)
      .set('Content-Type', 'text/plain')
      .send('not gonna work')
      .expect(401);
  });
});
