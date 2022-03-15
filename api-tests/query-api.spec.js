require('dotenv').config();
const chai = require('chai');
const { v4: uuid } = require('uuid');
const request = require('./lib/supertest');

// const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const server = require('../server/app');

// Global Seed
// const databaseCleaner = require('../database/seeds/00_job_database_cleaner');

describe('Query API tests.', () => {
  before(async function () {
    // database would have to be seeded by the schemas themselves?
  });

  describe('Grower Account GET', () => {
    it(`Should call GET successfully with organization_id`, async () => {
      const _res = await request(server)
        .get(`/grower_accounts`)
        .query({
          organization_id: uuid()
         })
        .set('Accept', 'application/json')
        .expect(200);
    });

    it(`Should call GET successfully with region_id`, async () => {
      const _res = await request(server)
        .get(`/grower_accounts`)
        .query({
          region_id: uuid()
         })
        .set('Accept', 'application/json')
        .expect(200);
    });

    it(`Should call GET successfully with organization_id and region_id`, async () => {
      const _res = await request(server)
        .get(`/grower_accounts`)
        .query({
          organization_id: uuid(),
          region_id: uuid()
         })
        .set('Accept', 'application/json')
        .expect(200);
    });


    it(`Should call GET successfully with author=true`, async () => {
      const _res = await request(server)
        .get(`/grower_accounts`)
        .query({
          author: true
         })
        .set('Accept', 'application/json')
        .expect(200);
    });
  });

});
