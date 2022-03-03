const Session = require("../models/Session");
const expect = require("expect-runtime");
const HttpError = require("../utils/HttpError");

class GrowerAccountQueryRepository{

  constructor(tableName, session){
    expect(tableName).defined();
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
  async getByFilter(filter, options){
    const whereBuilder = function(object, builder){
      let result = builder;
      if(object['and']){
        expect(Object.keys(object)).lengthOf(1);
        expect(object['and']).a(expect.any(Array));
        for(let one of object['and']){
          if(one['or']){
            result = result.andWhere(subBuilder => whereBuilder(one, subBuilder));
          }else{
            expect(Object.keys(one)).lengthOf(1);
            result = result.andWhere(Object.keys(one)[0], Object.values(one)[0]);
          }
        }
      }else if(object['or']){
        expect(Object.keys(object)).lengthOf(1);
        expect(object['or']).a(expect.any(Array));
        for(let one of object['or']){
          if(one['and']){
            result = result.orWhere(subBuilder => whereBuilder(one, subBuilder));
          }else{
            expect(Object.keys(one)).lengthOf(1);
            result = result.orWhere(Object.keys(one)[0], Object.values(one)[0]);
          }
        }
      }else{
        result.where(object);
      }
      return result;
    }
    let promise = this.joinedTables().where(builder => whereBuilder(filter, builder));
    if(options && options.limit){
      promise = promise.limit(options && options.limit);
    }
    const result = await promise;
    expect(result).a(expect.any(Array));
    return result;
  }

  joinedTables(){
    return this._session.getDb()
      .table(this._growerAccountTable)
      .select(`${this._growerAccountTable}.*`)
      .leftJoin(this._authorTable, `${this._authorTable}.handle`, `${this._growerAccountTable}.wallet`)
      .leftJoin(this._stakeholderTable, `${this._stakeholderTable}.id`, `${this._growerAccountTable}.organization_id`)
  }

  async countByFilter(filter){
    const result = await this.joinedTables().where(filter);
    expect(result).match([{
      count: expect.any(String),
    }]);
    return parseInt(result[0].count);
  }

}

module.exports = GrowerAccountQueryRepository;
