import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactrum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { UpdateEditUser } from '../src/user/dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactrum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  // auth test
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@example.com',
      password: 'Testicle@1',
    };
    // signup test
    describe('Signup', () => {
      it('should thow exception if email empty', () => {
        return pactrum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw exception if password empty', () => {
        return pactrum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw exception if email invalid', () => {
        return pactrum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'invalid-email',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw exception if password is invalid', () => {
        return pactrum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: 'short',
          })
          .expectStatus(400);
      });
      it('should throw exception if no body provided', () => {
        return pactrum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactrum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .expectJsonLike({
            user: {
              // id: like(1),
              id: "typeof $V === 'number'",
              email: dto.email,
            },
            access_token: "typeof $V === 'string'",
          });
      });
    });

    // login test
    describe('login', () => {
      it('should throw exception if password is empty', () => {
        return pactrum.spec().post('/auth/login').withBody({
          email: dto.email,
        });
      });
      it('should throw exception if email is empty', () => {
        return pactrum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw exception if no body is provided', () => {
        return pactrum
          .spec()
          .post('/auth/login')
          .withBody({})
          .expectStatus(400);
      });
      it('should login', () => {
        return pactrum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .stores('access_token', 'access_token');
      });
    });
  });

  // user test
  describe('User', () => {
    // profile test
    describe('profile', () => {
      it('should throw exception if no access token', () => {
        return pactrum.spec().get('/user/profile').expectStatus(401);
      });
      it('Should get profile', () => {
        return pactrum
          .spec()
          .get('/user/profile')
          .withBearerToken('$S{access_token}')
          .expectStatus(200);
      });
    });
    // update user test
    describe('update', () => {
      it('should throw exception if no access token is provided', () => {
        return pactrum.spec().patch('/user/update').expectStatus(401);
      });
      it('should update user', () => {
        const updateData: UpdateEditUser = {
          firstName: 'Testicle',
          email: 'testicle@example.com',
        };
        return pactrum
          .spec()
          .patch('/user/update')
          .withBearerToken('$S{access_token}')
          .withBody(updateData)
          .expectStatus(200)
          .inspect()
          .expectBodyContains(updateData.firstName);
      });
    });
    // delete user test
    describe('delete', () => {
      it('should throw exception if no access token is provided', () => {
        return pactrum.spec().delete('/user/delete').expectStatus(401);
      });
      it('should delete user', () => {
        return pactrum
          .spec()
          .delete('/user/delete')
          .withBearerToken('$S{access_token}')
          .expectStatus(200);
      });
    });
  });

  // bookmark test
  describe('Bookmark', () => {
    // get empty bookmarks test
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactrum
          .spec()
          .get('/bookmark')
          .withBearerToken('$S{access_token}')
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
