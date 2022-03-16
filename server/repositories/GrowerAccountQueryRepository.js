const log = require('loglevel');

class GrowerAccountQueryRepository {
  constructor(session) {
    log.debug('constructor');
    log.debug(session);
    this._session = session;
    this._growerAccountTable = 'treetracker.grower_account';
    this._authorTable = 'messaging.author';
    this._stakeholderTable = 'stakeholder.stakeholder';
    this._regionsTable = 'regions.region';
  }

  _whereBuilder(object, builder) {
    const knex = this._session.getDB();
    const result = builder;

    if (object.region_id) {
      result.where('regions.region.id', object.region_id);
    }
    if (object.organization_id) {
      result.whereIn('grower_account.organization_id', function () {
        this.select('stakeholder_id').from(
          knex.raw(`stakeholder.getstakeholderchildren(?)`, [
            object.organization_id,
          ]),
        );
      });
    }
    if (object.author === 'true') {
      result.whereNotNull('author.handle');
    }

    return result;
  }

  _joinedTables(region_id) {
    log.debug('joinedTables');
    log.debug(this._session);
    const joinedTables = this._session
      .getDB()
      .table(this._growerAccountTable)
      .leftJoin(
        this._authorTable,
        `${this._authorTable}.handle`,
        `${this._growerAccountTable}.wallet`,
      )
      .leftJoin(
        this._stakeholderTable,
        `${this._stakeholderTable}.id`,
        `${this._growerAccountTable}.organization_id`,
      );

    if (region_id) {
      joinedTables.join(
        this._regionsTable,
        this._session.getDB().raw(`ST_WITHIN(
          ${this._growerAccountTable}.location,
          ${this._regionsTable}.shape
        )`),
      );
    }

    return joinedTables;
  }

  /*
   * select by filter
   * support: and / or
   * options:
   *  limit: number
   */
  async getByFilter(filter, options) {
    let promise = this._joinedTables(filter.region_id)
      .select([
        `${this._growerAccountTable}.id`,
        `${this._authorTable}.handle`,
        `${this._growerAccountTable}.wallet`,
        `${this._growerAccountTable}.first_name`,
        `${this._growerAccountTable}.last_name`,
        `${this._growerAccountTable}.image_url`,
        `${this._growerAccountTable}.image_rotation`,
        `${this._growerAccountTable}.first_registration_at`,
        `${this._growerAccountTable}.organization_id`,
        `${this._growerAccountTable}.person_id`,
      ])
      .where((builder) => this._whereBuilder(filter, builder));
    if (options && options.limit) {
      promise = promise.limit(options && options.limit);
    }
    const result = await promise;
    return result;
  }

  async countByFilter(filter) {
    const result = await this._joinedTables(filter.region_id)
      .count()
      .where((builder) => this._whereBuilder(filter, builder));
    return parseInt(result[0].count);
  }
}

module.exports = GrowerAccountQueryRepository;
