const log = require("loglevel");

class GrowerAccountQueryRepository{

  constructor(session){
    log.debug("constructor");
    log.debug(session);
    this._session = session;
    this._growerAccountTable = 'treetracker.grower_account';
    this._authorTable = 'messaging.author';
    this._stakeholderTable = 'stakeholder.stakeholder';
  }

  /*
   * select by filter
   * support: and / or
   * options:
   *  limit: number
   */
  async  getByFilter(filter, options){
    const whereBuilder = function(object, builder){
      const result = builder;
      log.info(object)
      
      if(object.region_id){
        log.debug('skippin region table')
        // result.where('regions.region.id', object.region_id)        
      }
      if(object.organization_id){
        result.where('stakeholder.stakeholder.id', object.organization_id)
      }

      if(object.author === 'true'){
        result.whereNotNull('author.handle')
      }
      
      return result;
    }
    let promise = this.joinedTables().where(builder => whereBuilder(filter, builder));
    if(options && options.limit){
      promise = promise.limit(options && options.limit);
    }
    const result = await promise;
    return result;
  }

  joinedTables(){
    log.debug("joinedTables");
    log.debug(this._session);
    return this._session.getDB()
      .table(this._growerAccountTable)
      .select([
               `${this._authorTable}.handle`, 
               `${this._growerAccountTable}.wallet`, 
               `${this._growerAccountTable}.first_name`, 
               `${this._growerAccountTable}.last_name`, 
               `${this._growerAccountTable}.image_url`, 
               `${this._growerAccountTable}.image_rotation`, 
               `${this._growerAccountTable}.first_registration_at`, 
               `${this._growerAccountTable}.organization_id`, 
               `${this._growerAccountTable}.person_id`, 
              //  `${this._stakeholderTable}.id as organization_id`
              ])
      .leftJoin(this._authorTable, `${this._authorTable}.handle`, `${this._growerAccountTable}.wallet`)
      .leftJoin(this._stakeholderTable, `${this._stakeholderTable}.id`, `${this._growerAccountTable}.organization_id`)
  }

  async countByFilter(filter){
    const result = await this.joinedTables().where(filter);
    return parseInt(result[0].count);
  }

}

module.exports = GrowerAccountQueryRepository;