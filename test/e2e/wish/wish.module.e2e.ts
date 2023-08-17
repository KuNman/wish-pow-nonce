import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { ComputationModel, WishModel } from '../../../src/databases/postgresql/models';
import ComputationQueueService from '../../../src/wish/services/computation-queue.service';
import WishModule from '../../../src/wish/wish.module';
import WishRepository from '../../../src/wish/wish.repository';
import WishService from '../../../src/wish/services/wish.service';
import ComputationQueueServiceMock from '../../mocks/computation-queue.service.mock';

describe('WishModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [WishModel, ComputationModel],
          logging: false,
          synchronize: true,
          autoLoadEntities: true,
        }),
        WishModule,
      ],
    })
      .overrideProvider(ComputationQueueService)
      .useClass(ComputationQueueServiceMock)
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  describe('PUT /', () => {
    describe('API', () => {
      it('returns correct status code', async () => {
        const res = await request(app.getHttpServer())
          .put('/');

        expect(res.statusCode)
          .toEqual(HttpStatus.CREATED);
      });

      it('returns correct body', async () => {
        const { body } = await request(app.getHttpServer())
          .put('/');

        expect(/^\{?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}?$/.test(body.uuid))
          .toBe(true);
        expect(body.createdAt)
          .toBeDefined();
      });
    });

    describe('DB', () => {
      it('saves wishes correctly', async () => {
        const rndInt = Math.floor(Math.random() * 6) + 1;

        const promises = [];
        while (promises.length < rndInt) {
          promises.push(request(app.getHttpServer())
            .put('/'));
        }

        await Promise.all(promises);

        const dataSource = app.get(DataSource);
        const result = await dataSource.query('SELECT * FROM \'wishes\'');

        expect(result.length)
          .toEqual(rndInt);
      });
    });
  });

  describe('GET /', () => {
    describe('non computed wish', () => {
      describe('API', () => {
        let wish: WishModel;

        beforeEach(async () => {
          const wishService = await app.resolve(WishService);
          wish = await wishService.create();
        });

        it('returns correct status code', async () => {
          const res = await request(app.getHttpServer())
            .get(`/?uuid=${wish.uuid}`);

          expect(res.statusCode)
            .toEqual(HttpStatus.NO_CONTENT);
        });
      });
    });

    describe('computed wish', () => {
      describe('API', () => {
        let wish: WishModel;

        beforeEach(async () => {
          const wishService = await app.resolve(WishService);
          wish = await wishService.create();

          const dataSource = app.get(DataSource);
          const computationRepository = dataSource.getRepository(ComputationModel);

          const computation = await computationRepository.save(computationRepository.create({
            powNonce: 1,
          }));

          const wishRepository = await app.resolve(WishRepository);

          await wishRepository.updateComputation(wish.uuid, computation);
          wish = await wishRepository.findById(wish.uuid);
        });

        it('returns correct status code', async () => {
          const res = await request(app.getHttpServer())
            .get(`/?uuid=${wish.uuid}`);

          expect(res.statusCode)
            .toEqual(HttpStatus.OK);
        });

        it('returns correct body', async () => {
          const { body } = await request(app.getHttpServer())
            .get(`/?uuid=${wish.uuid}`);

          expect(/^\{?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}?$/.test(body.uuid))
            .toBe(true);
          expect(body.computation.powNonce)
            .toBe(1);
          expect(body.computation.time)
            .toBeDefined();
          expect(body.computation.hash)
            .toBeDefined();
        });
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
